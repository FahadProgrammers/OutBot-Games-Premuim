import {
  ActionRow,
  ActionRowBuilder,
  AnyComponentBuilder,
  APIButtonComponent,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
  MessageComponentInteraction,
  PermissionsBitField,
  TextChannel,
  User,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import mainembed from "../../utils/embeds/mainEmbed";
import randomwordSuccess from "../../utils/games/success";
import warningembed_1 from "../../utils/embeds/warnembed";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import mainembedNodetils from "../../utils/embeds/mainembedNodetils";
import mainembedNodetils2 from "../../utils/embeds/mainembedNodetils2";
import channel from "../../schema/SchemaChannel";
import emoji from "../../utils/functions/emojis";
import warnembed from "../../utils/embeds/warnembed";
const RPS = require("discord-rock-paper-scissor");
const rps = new RPS();
export default class اكس extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "حجره",
      description: "لعبه حجره ( حجره ورقه مقص )",
      category: Category.ثنائيه,
      cooldown: 3,
      aliases: [],
    });
  }
  async execute(message: Message) {
    const args = message.content.split(" ");
    let member: User | null | undefined;
    const botId = this.client.user?.id;
    if (args[1] === "بوت") {
      member = this.client.user;
    } else {
      member = message.mentions.users?.first();
    }
    const choices = [
      {
        name: "حجره",
        customId: "Rock",
        emoji: "🪨",
        beats: "Scissors",
      },
      {
        name: "ورقه",
        customId: "Paper",
        emoji: "📄",
        beats: "Rock",
      },
      {
        name: "مقص",
        customId: "Scissors",
        emoji: "✂️",
        beats: "Paper",
      },
    ];

    if (!member) {
      const embed = warnembed(
        `${emoji.false} | تأكد من منشن عضو او كتابه كلمه بوت!`
      );
      await message.reply({
        embeds: [embed],
      });

      return;
    }
    if (message.author.id === member?.id) {
      const embed = warnembed(`${emoji.false} | تأكد من عدم منشن نفسك او بوت!`);
      await message.reply({
        embeds: [embed],
      });
      return;
    }
    const embed = mainembed(
      `<@${member?.id}> | هل تريد العب ضد <@${message.author?.id}>`
    );

    const rowSend = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(`قبول`)
        .setCustomId(`true-${message.author.id}`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel(`رفض`)
        .setCustomId(`false-${message.author.id}`)
        .setStyle(ButtonStyle.Danger)
    );

    if (!member?.bot) {
      if (message.channel instanceof TextChannel) {
        const sendInteraction = await message.channel.send({
          embeds: [embed],
          components: [rowSend],
        });
        const MessagetargetUserInteraction = await sendInteraction
          .awaitMessageComponent({
            filter: (i) => i.user.id === member?.id,
            time: 10_000,
          })
          .catch(async (error) => {
            embed.setDescription(`<@${member?.id}> | انتهى الوقت ولم يستجيب.`);
            await sendInteraction.edit({
              embeds: [embed],
              components: [],
            });
            return;
          });

        if (!MessagetargetUserInteraction) return;
        if (
          MessagetargetUserInteraction.customId === `true-${message.author.id}`
        ) {
          if (message.guild) {
            const embeddone = BaseEmbed(
              message.guild,
              {
                title: "تم قبول اللعبه",
                des: `${emoji.true} | تم قبول اللعبه`,
                line: false,
                footer: "حجره",
                fields: "حجره",
              },
              "Success"
            );
            if (embeddone) {
              await sendInteraction.edit({
                embeds: [embeddone],
                components: [],
              });
              startGame();
            }
          }
        } else if (
          MessagetargetUserInteraction.customId === `false-${message.author.id}`
        ) {
          const embedwarn = warnembed(`${emoji.false} | تم رفض قبول اللعبه`);
          await sendInteraction.edit({
            embeds: [embedwarn],
            components: [],
          });
          return;
        }
      }
    } else {
      startGame();
    }
    async function startGame() {
      const emb = mainembed(`حان دور <@${member?.id}> ل العب!`);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        choices.map((choice) => {
          return new ButtonBuilder()
            .setCustomId(choice.customId)
            .setLabel(choice.name)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(choice.emoji);
        })
      );

      const reply = await message.reply({
        content: `<@${message.author.id}> ⚔️ <@${member?.id}>`,
        embeds: [emb],
        components: [row],
      });
      const randomcho = choices[Math.floor(Math.random() * choices.length)];
      if (!member?.bot) {
        const targetUserInteraction = await reply
          .awaitMessageComponent({
            filter: (i) => i.user.id === member?.id,
            time: 10_000,
          })
          .catch(async (error) => {
            emb.setDescription(`<@${member?.id}> | انتهى الوقت ولم يستجيب.`);
            await reply.edit({
              embeds: [emb],
              components: [],
            });
            return;
          });

        if (!targetUserInteraction) return;

        const targetUserChoice = choices.find(
          (choice) => choice.customId === targetUserInteraction.customId
        );

        await targetUserInteraction.reply({
          content: `لقد اختار ${targetUserChoice?.name} ${targetUserChoice?.emoji}`,
          ephemeral: true,
        });
        emb.setDescription(`حان دور <@${message.author?.id}> ل العب!`);
        await reply.edit({
          content: `<@${message.author.id}> حان دور الان!`,
          embeds: [emb],
        });

        const initialUserIntercation = await reply
          .awaitMessageComponent({
            filter: (i) => i.user.id === message.author?.id,
            time: 15_000,
          })
          .catch(async (error) => {
            emb.setDescription(
              `<@${message.author?.id}> | انتهى الوقت ولم يستجيب.`
            );
            await reply.edit({
              embeds: [emb],
              components: [],
            });
          });

        if (!initialUserIntercation) return;

        const initialUserChoice = choices.find(
          (choice) => choice.customId === initialUserIntercation.customId
        );

        let result;

        if (targetUserChoice?.beats === initialUserChoice?.customId) {
          result = `<@${member?.id}> فاز!`;
        }

        if (initialUserChoice?.beats === targetUserChoice?.customId) {
          result = `<@${message.author?.id}> فاز!`;
        }

        if (targetUserChoice?.customId === initialUserChoice?.customId) {
          result = `!تعادل`;
        }

        emb.setDescription(`
        <@${member?.id}> اختار ${targetUserChoice?.name} ${targetUserChoice?.emoji}\n
        <@${message.author?.id}> اختار ${initialUserChoice?.name} ${initialUserChoice?.emoji} 
        \n\n${result}`);

        await reply.edit({
          embeds: [emb],
          components: [],
        });
      } else {
        const targetUserChoice = choices.find(
          (choice) => choice.customId === randomcho.customId
        );

        emb.setDescription(`حان دور <@${message.author?.id}> ل العب!`);
        await reply.edit({
          content: `<@${message.author.id}> حان دور الان!`,
          embeds: [emb],
        });

        const initialUserIntercation = await reply
          .awaitMessageComponent({
            filter: (i) => i.user.id === message.author?.id,
            time: 15_000,
          })
          .catch(async (error) => {
            emb.setDescription(
              `<@${message.author?.id}> | انتهى الوقت ولم يستجيب.`
            );
            await reply.edit({
              embeds: [emb],
              components: [],
            });
          });

        if (!initialUserIntercation) return;

        const initialUserChoice = choices.find(
          (choice) => choice.customId === initialUserIntercation.customId
        );

        let result;
        let winner;

        if (targetUserChoice?.beats === initialUserChoice?.customId) {
          result = `<@${member?.id}> فاز!`;
          winner = member?.id;
        }

        if (initialUserChoice?.beats === targetUserChoice?.customId) {
          result = `<@${message.author?.id}> فاز!`;
          winner = message.author.id;
        }

        if (targetUserChoice?.customId === initialUserChoice?.customId) {
          result = `!تعادل`;
          winner = botId;
        }

        emb.setDescription(`
      اخترت ${targetUserChoice?.name} ${targetUserChoice?.emoji}\n
      <@${message.author?.id}> اختار ${initialUserChoice?.name} ${initialUserChoice?.emoji} 
      \n\n${result}`);

        if (winner !== botId) {
          const schema_2 =
            (await schema.findOne({
              guildId: message.guild?.id,
              userId: winner,
            })) ||
            new schema({
              guildId: message.guild?.id,
              userId: winner,
              p: 0,
            });

          schema_2.p += 1;
          await schema_2.save();

          const rank_2 = rank(schema_2.p);
          const schema_3 = (await schema.findOne({
            guildId: message.guild?.id,
            userId: winner,
          })) || { p: 1 };

          const btns = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setEmoji(rank_2.emoji)
              .setCustomId("rank_info")
              .setStyle(ButtonStyle.Secondary)
              .setLabel(`${rank_2.name} ( ${schema_3.p} )`)
          );

          await reply.edit({
            embeds: [emb],
            components: [btns],
          });
        } else {
          await reply.edit({
            embeds: [emb],
            components: [],
          });
        }
      }
    }

    //       let mid: string;
    //       const args = message.content.split(" ").slice(1);
    //       const text = args[0];

    //        if(message.channel instanceof TextChannel) {
    //        if(!text) {
    //          message.channel.send({
    //           embeds: [mainembed(`يرجى كتابه بعد الامر \n \` بوت \` او \` منشن الاعب \` `)]
    //         })

    //         return;
    //       }
    // if(text === "بوت" || member)  {
    //   mid = member ? member.id : 'bot';
    //       const buttons1 = new ActionRowBuilder<ButtonBuilder>()
    //       .addComponents(
    //         new ButtonBuilder()
    //         .setLabel("حجره")
    //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    //         .setStyle(ButtonStyle.Secondary)
    //         .setCustomId(`button_1`),

    //         new ButtonBuilder()
    //         .setLabel("ورقه")
    //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    //         .setStyle(ButtonStyle.Secondary)
    //         .setCustomId(`button_2`),

    //         new ButtonBuilder()
    //         .setLabel("مقص")
    //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    //         .setStyle(ButtonStyle.Secondary)
    //         .setCustomId(`button_3`),
    //       );

    // //       const buttons2 = new ActionRowBuilder<ButtonBuilder>()
    // //       .addComponents(
    // //         new ButtonBuilder()
    // //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //         .setStyle(ButtonStyle.Secondary)
    // //         .setCustomId(`button_4`),

    // //                  new ButtonBuilder()
    // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //       .setStyle(ButtonStyle.Secondary)
    // //       .setCustomId(`button_5`),

    // //              new ButtonBuilder()
    // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //       .setStyle(ButtonStyle.Secondary)
    // //       .setCustomId(`button_6`),
    // //       );

    // //       const buttons3 = new ActionRowBuilder<ButtonBuilder>()
    // //       .addComponents(
    // //         new ButtonBuilder()
    // //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //         .setStyle(ButtonStyle.Secondary)
    // //         .setCustomId(`button_7`),

    // //                  new ButtonBuilder()
    // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //       .setStyle(ButtonStyle.Secondary)
    // //       .setCustomId(`button_8`),

    // //              new ButtonBuilder()
    // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
    // //       .setStyle(ButtonStyle.Secondary)
    // //       .setCustomId(`button_9`),
    // //       );

    //       const messageFetch = await message.reply({
    //         content: `حان دور ${member ? `<@${member.id}>` : 'البوت'}`,
    //         components: [buttons1]
    //       });

    //       const coll = await messageFetch.createMessageComponentCollector({
    //       componentType: ComponentType.Button,
    //       time: 10000,
    //       filter: m => !m.user.bot
    //       });
    //       coll.on("collect", async (m) => {
    //         if(m.user.id === mid || mid === "bot") {
    //           if(mid !== "bot") {
    //             const [, id] = m.customId.split("_")
    //             const btn = await m.message.components.map((com) => {
    //               const f = com.components.some(row => row.customId?.includes(`_${id}`));
    //               const fff = com.components.find(row => row.customId?.includes(`_${id}`));
    //             });
    //             await messageFetch.edit({
    //               content: `لقد اختار ${member ? : ''}`,
    //               components: [
    //                 new ActionRowBuilder<ButtonBuilder>().addComponents(
    //                   ...m.message.components[0].components.map((com) => {
    //                     if (com.customId?.includes(`_${id}`)) {
    //                       return ButtonBuilder.from(com as APIButtonComponent).setDisabled(true);
    //                     }
    //                     return ButtonBuilder.from(com as APIButtonComponent);
    //                   })
    //                 ),
    //               ],
    //             });
    //         } else {
    //           m.reply({
    //             content: `:x: | حان دور البوت او الخصم`,
    //             ephemeral: true
    //           });
    //           return;

    //         }
    //         }
    //        });
    //        } else {
    //       message.channel.send({
    //         embeds: [mainembed(`يرجى كتابه بعد الامر \n \` بوت \` او \` منشن الاعب \` `)]
    //       });
    //       return;
    //     }
  }
}
// }
