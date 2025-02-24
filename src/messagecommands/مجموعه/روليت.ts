import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Message,
  SlashCommandSubcommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import schemaGame from "../../schema/Roulette/SchemaRoulette";
import { startRouletteGame } from "../../utils/roulette/wheel";
import emoji from "../../utils/functions/emojis";
import roulettePoints from "../../schema/Roulette/SchemaRoulettePoints";

export default class Roulette extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "روليت",
      description: "لعبه روليت",
      category: Category.مجموعه,
      cooldown: 3,
      aliases: ["roulette", "رول"],
    });
  }

  async execute(message: Message) {
    try {
      //Types
      let roulette_status = true;
      const idMap = new Map<
        string,
        { guildId: string; channelId: string; number: number; msgId: string }
      >();
      const playersMap: Array<{
        security?: boolean;
        winner?: boolean;
        user: any;
        username: string;
        userId: string;
        number: number;
        image: string;
      }> = [];

      //Game in TimeStamp ( not used)
      // const timestart = `**<t:${Math.floor(
      //   (Date.now() + 15 /* 15 Seconds */ * 1000) / 1000
      // )}:R>**`;

      //Find Game To DataBase
      const findGame = await schemaGame.findOne({
        guildId: message.guild?.id,
        channelId: message.channel.id,
      });

let msgRemoveRoulette: Message;
      if (findGame) {
         const ButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`إلغاء اللعبه المتوفره`)
          .setCustomId(`rremove_${message.guildId}`)
          .setEmoji("<:emoji_24:1327724457732603945>")
        );

        msgRemoveRoulette = await message.reply({
          content: `${emoji.false} | لايمكن تشغيل اكثر من لعبه روليت بنفس الروم!`,
          components: [ButtonRow],
        });

        return;
      }

      //Embed Game
      
      const embd = new EmbedBuilder()
        .addFields([
          {
            name: "__طريقة اللعب:__ <:theory:1328358024527478844>",
            value: `
      **1**. انضم في اللعبه من خلال الزر ( <:emoji_26:1327724484815228948> )
            **2**. ستبدأ الجولة الأولى وسيتم تدوير العجلة واختيار لاعب عشوائي
            **3**. إذا كنت اللاعب المختار ، فستختار لاعبًا من اختيارك ليتم طرده من اللعبة`,
          },
          {
            name: `__الاعبين__ <:emoji_24:1327724457732603945>`,
            value: "لايوجد",
          },
        ])
        .setTimestamp()
        .setFooter({
          text: `OutBot Games - "Game"`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&",
        })
        .setColor("Red")
        .setAuthor({
          name: `OutBot Games - "Game"`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&",
        });
      const actionRows = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("joingame")
          .setEmoji(emoji.roulette.join_game)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("leavegame")
          .setEmoji(emoji.roulette.leave_game)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("shopgame")
          .setEmoji(emoji.roulette.shop)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("timedisabled")
          .setEmoji(emoji.roulette.time)
          .setLabel("15")
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary)
      );

      if (message.channel instanceof TextChannel) {
        let time = 15;
        const msg = await message.channel.send({
          embeds: [embd],
          components: [actionRows],
        });
        const interval = setInterval(async function () {
          const editedComponents =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              actionRows.components[0],
              actionRows.components[1],
              actionRows.components[2],
              actionRows.components[3].setLabel(time.toString())
            );
          await msg.edit({ components: [editedComponents] });

          time -= 1;

          if (time < 0) {
            clearInterval(interval);
          }
        }, 1000);

        let findGameMsg = await schemaGame.findOne({
          guildId: message.guild?.id,
          channelId: message.channel.id,
          msgId: msg.id,
        });

        if (!findGameMsg) {
          await new schemaGame({
            guildId: message.guild?.id,
            channelId: message.channel.id,
            players: [],
            msgId: msg.id,
          }).save();
        }

        //Local DataBase

        idMap.set(`${message.guild?.id}-${message.channel.id}-${msg.id}`, {
          guildId: message.guild?.id ?? "",
          channelId: message.channel.id,
          number: 0,
          msgId: msg.id,
        });

        setTimeout(async () => {
          //Disabled Buttons
          const disabledRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              actionRows.components[0].setDisabled(true),
              actionRows.components[1].setDisabled(true),
              actionRows.components[2].setDisabled(true),
              actionRows.components[3]
            );

          await msg.edit({ components: [disabledRow] });
          if(roulette_status === false) return;
          findGameMsg = await schemaGame.findOne({
            guildId: message.guild?.id,
            channelId: message.channel.id,
            msgId: msg.id,
          });
          
          if (findGameMsg) {
            if (findGameMsg?.players.length < 3) {
              await message.reply({
                content: `${emoji.false} | لايمكن تشغيل اللعبه يلزم تواجد **3** على الاقل!`,
              });

              await findGameMsg?.deleteOne({
                guildId: message.guild?.id,
                channelId: message.channel.id,
                msgId: msg.id,
              });
              return;
            }
            await startRouletteGame(message, playersMap, this.client, msg.id);
          }
        }, 15000);

        this.client.on("interactionCreate", async (interaction) => {
          if (!interaction.isButton()) return;

          const username = interaction.user.username;
          const key = `${message.guild?.id}-${message.channel.id}-${msg.id}`;
          const data = idMap.get(key);


          if(interaction.customId === `rremove_${interaction.guildId}`) {

         if(!interaction.memberPermissions?.has("ManageEvents")) {
          await interaction.reply({
            content: `${emoji.false} | ليس لديك الصلاحيات الكافيه لإلغاء اللعبه!`,
          });
          return;
          }

          const findGame = await schemaGame.findOne({
            guildId: message.guild?.id,
            channelId: message.channel.id,
            msgId: msg.id,
          });


          if(!findGame) {
            await interaction.reply({
              content: `${emoji.false} | اللعبه غير متوفره للإلغاء!`,
              ephemeral: true
            });
            return;
          }          
          
          if (!interaction.replied && !interaction.deferred) {
            
            await interaction.reply({
            content: `${emoji.true} | تم إلغاء اللعبه بنجاح!`,
            ephemeral: true
          });  
        }
          
   const components = interaction.message.components.map((row) => {
          const actionRow = new ActionRowBuilder<ButtonBuilder>();

          row.components.forEach((component) => {
            if (component.type === ComponentType.Button) {
              const buttonData = {
                ...component,
                url: component.url ?? undefined, // معالجة الحقل `url`
                label: component.label ?? "زر بدون عنوان", // توفير نص افتراضي
                style: component.data.style ?? ButtonStyle.Primary,
                custom_id:
                  component.customId ?? `${interaction.user.id}`,
                emoji: component.emoji ?? { name: ":fire:" },
                disabled: true,
              };

              if (!buttonData.label && !(component.data as any).emoji) {
                buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
              }
              actionRow.addComponents(new ButtonBuilder(buttonData));
            }
          });

          return actionRow;
        }) as ActionRowBuilder<ButtonBuilder>[];

         interaction.message.edit({
          components: components.map((row) => row.toJSON()),
        });



        await findGame.deleteOne({
          guildId: message.guild?.id,
          channelId: message.channel.id,
          msgId: msg.id,
        });

          roulette_status = false;
        }
          if (interaction.customId === "shopgame") {
            let disableS = false;
            let disableDobule = false;

            const findRoulette = await schemaGame.findOne({
              guildId: interaction.guild?.id,
              channelId: interaction.channel?.id,
              msgId: data?.msgId,
            });

            const find = findRoulette?.players.find(
              (p) => p.userId === interaction.user?.id
            );
            if (find?.securityUsed === true) {
              disableS = true;
            }
            if (findRoulette?.dobuleUsed === true) {
              disableDobule = true;
            }
            const findPoints = (await roulettePoints.findOne({
              guildId: interaction.guildId,
              userId: interaction.user?.id,
            })) || { p: "لايوجد" };
            const rows = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setEmoji("<:security1:1329156583992590456>")
                .setLabel("الحمايه الشخصيه")
                .setDisabled(disableS)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(
                  `roulette_secruity_${interaction.user.id}_${interaction.guild?.id}_${data?.msgId}_${data?.number}`
                ),
              new ButtonBuilder()
                .setEmoji("<:star:1328433221536583831>")
                .setLabel("دبل نقاط")
                .setDisabled(disableDobule)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(
                  `roulette_dobule_${interaction.user.id}_${interaction.guild?.id}_${data?.msgId}_${data?.number}`
                ),
              new ButtonBuilder()
                .setEmoji("<:Arrow1:1299711671052402718>")
                .setLabel(`تملك: ${findPoints.p}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`DisablePoints`)
            );
            await interaction.reply({
              content: `
1. <:star:1328433221536583831> دبل نقاط
يتم الحصول على دبل نقاط للكل
تحتاج الى : **50 عمله**َ
2. <:security1:1329156583992590456> الحمايه الشخصيه 
يتم حمايتك من الحارس الشخصي 
تحتاج الى : **100 عمله**
3. <:emoji_24:1327724457732603945> الغاء جوله روليت
يتم تحديد شخص من بداية الجوله اذا تم اختياره للمره الاولى لايتمكن.
تحتاج الى : **150 عمله**
مره واحده للجميع!`,
              ephemeral: true,
              components: [rows],
            });
          }

          if (interaction.customId === "joingame" && data) {
            const findisReadyPlayer = await playersMap.find(p => p.userId ===  interaction.user.id);
            if(findisReadyPlayer) {
              await interaction.reply({
                content: `${emoji.false} | انت داخل اللعبه بلفعل!`,
                ephemeral: true
              });
              return;
            }

            playersMap.push({
              user: interaction.user,
              username: username,
              userId: interaction.user.id,
              number: data.number,
              image: interaction.user.displayAvatarURL({
                size: 256,
                extension: "png",
              }),
            });

            //add number to use next player

            data.number += 1;
            const gameData = await schemaGame.findOne({
              guildId: message.guild?.id,
              channelId: message.channel.id,
              msgId: msg.id,
            });

            if (gameData) {
              //Add Players To Main DataBase
              await gameData.updateOne({ players: playersMap });
            };
          
            // تعريف المتغيرات
const PlayersmapToString = playersMap && Array.isArray(playersMap) && playersMap.length > 0
? playersMap
    .map((data, index) => `<@${data.user?.id}> | #${index + 1}`)
    .join("\n")
: "لايوجد";

try {
  if(embd.data.fields) {
// embd.data.fields[1].value =  PlayersmapToString,
embd.data.description = `__**اللاعبين:**__\n${PlayersmapToString}`

// تحديث التفاعل بالرسالة الجديدة
await interaction.update({ embeds: [embd] });
  }
} catch (error) {
console.error("حدث خطأ أثناء تحديث الرسالة:", error);
}
          }
        

          if (interaction.customId === "leavegame") {

            const gameData = await schemaGame.findOne({
              guildId: message.guild?.id,
              channelId: message.channel.id,
              msgId: msg.id,
            });

            if (gameData) {

              const index = playersMap.findIndex(
                (player) => player.user.id === interaction.user.id
              );
              if (index !== -1) {
                const removedPlayer = playersMap.splice(index, 1)[0];

                gameData.players = playersMap;
                await gameData.save();
                if (embd.data.fields) {

                  gameData.players = playersMap;
                  await gameData.save();

                  //Delete in Player in Filed
                  embd.data.fields = embd.data.fields.filter(
                    (field) =>
                      !field.value.includes(`<@${removedPlayer.userId}>`)
                  );
                  await interaction.update({ embeds: [embd] });
                }

                await interaction.reply({
                  content: `${emoji.true} | تم الخروج من الروليت`,
                  ephemeral: true,
                });
              } else {
                await interaction.reply({
                  content: `${emoji.false} | لم تنضم الى الروليت للخروج!`,
                  ephemeral: true,
                });
              }
            } else {
              await interaction.reply({
                content: `${emoji.false} | اللعبه غير متوفره بلوقت الحالي`,
                ephemeral: true,
              });
            }
          }
        });
      }
    } catch (err) {
      console.error("Error in roulette game:", err);
    }
  }
}
