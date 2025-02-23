import {
  ActionRowBuilder,
  Base,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaPremuim";
import SchemaPremuimBots from "../../schema/SchemaPremuimBots";
import ms from "ms";
import moment from "moment";
import emoji from "../../utils/functions/emojis";
import utils from "../../utils/utils";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("owners")
        .setDescription("owners...")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommandGroup(command => command
          .setName('webhook')
          .setDescription('dd')
          .addSubcommand(command => command
            .setName('send')
            .setDescription('إرسال ويبهوك.')
            
        .addStringOption((string) =>
          string
            .setName("messageid")
            .setRequired(true)
            .setDescription("ايدي رسالة الي يتم إرسالها.")
        )
        .addBooleanOption((command) => command
      .setName('everyone')
    .setDescription('ارسال في الرسال منشن ايفريون True/False.').setRequired(true))
    .addStringOption((command) => command
    .setName('title')
  .setDescription("عنوان رسالة الايمبد.").setRequired(true))
          )
        )
        .addSubcommandGroup(command => command
          .setName('premuim')
          .setDescription(`إعطاء بريوميم الى شخص معين.`)
          .addSubcommand(command => command
            .setName('remove')
            .setDescription("إزالة بريوميم من شخص معين.")
            .addUserOption(command => command
              .setName('member')
              .setDescription('تحديد الشخص ل إزالته.')
              .setRequired(true)
            )
          )
          .addSubcommand(command => command
            .setName('botadd')
            .setDescription("إضافة بوت بريوميم.")
            .addStringOption(user => user
              .setName("token")
              .setRequired(true)
              .setDescription("token bot")
          )
          .addStringOption(string => string
              .setName("botid")
              .setRequired(true)
              .setDescription("guild of set")
          )
          )
          .addSubcommand(commandd => commandd
            .setName('add')
            .setDescription(`إعطاء بريوميم الى شخص معين.`)
        .addUserOption((user) =>
          user
            .setName("owner")
            .setRequired(true)
            .setDescription("owner to get bot")
        )
        .addStringOption((string) =>
          string
            .setName("guildid")
            .setRequired(true)
            .setDescription("guild of set")
        )
        .addStringOption((string) =>
          string.setName("time").setRequired(true).setDescription("time")
        )
      )
    )

    ,
      category: Category.Dev,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const subCommand = interaction.options.getSubcommand();
    const owner = interaction.options.getUser("owner");
    const guildId = interaction.options.getString("guildid");
    const time = interaction.options.getString("time") || null;
    const safeTime: string = time ?? "String";
    const UsersAllow = [
      "1106701699260882984",
      "709981152093667359",
      "1125812790158962839",
    ];

    if (!UsersAllow.includes(interaction.user.id)) {
      return interaction.editReply({
        content: "ممنوع يامعلم!",
      });
    }
    if(subCommand === "add") { 
    try {
      if (!interaction.guild?.id) {
        return interaction.editReply({
          content: `${emoji.false} | ?`,
        });
      }
      const endTime = moment().add(ms(safeTime)).format("YYYY-MM-DD HH:mm:ss");
      const findBotPrem = await SchemaPremuimBots.findOne({ own: false });
      if(!findBotPrem) return interaction.editReply({ content: "مخلصه الكميه" });

      new schema_1({
        token: findBotPrem.token,
        botId: findBotPrem.botId,
        guildId,
        owner: owner?.id,
        time: endTime,
        starttime: Date.now(),
      }).save();

      const findDataPremuimUser = await schema_1.findOne({
        guildId,
        owner: owner?.id,
      });

      const user = await interaction.client.users.cache.get(owner?.id ?? "");
      const guild = await interaction.guild;
      const channel = await guild.channels.cache.get(utils.premuimLogId);

      user?.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `<:Arrow1:1299711671052402718> تم تفعيل الإشتراك

تم بنجاح الإشتراك في بوت **OutBot Games** نتمنى الإستمتاع!`
            )
            .setTimestamp()
            .setFooter({
              text: `OutBot Games - System`,
              iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
            })
            .setColor("Red")
            .setAuthor({
              name: `OutBot Games - System`,
              iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
            }),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel("اضافه البوت")
              .setStyle(ButtonStyle.Link)
              .setURL(
                `https://discord.com/oauth2/authorize?client_id=${findDataPremuimUser?.botId}&scope=bot+applications.commands+applications.commands.permissions.update&guild_id=${guildId}&disable_guild_select=true&permissions=2080374975`
              )
              .setEmoji("<:Arrow1:1299711671052402718>")
          ),
        ],
      });

      await interaction.editReply({
        content: `☑️`,
      });
      const findDataPremuimUser2 = await schema_1.findOne({
        guildId,
        owner: owner?.id,
      });
      if (findDataPremuimUser2) {
        if (channel instanceof TextChannel) {
          channel?.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `<:Arrow1:1299711671052402718>  تم تفعيل اشتراك

                    ايدي البوت: \`${findDataPremuimUser2.botId}\`
                    من قبل : \`${interaction.user.id}\`
                    المالك : \`${owner?.id}\`
                    بدا منذ ( ممكن تقريبا ) : <t:${Math.floor(
                      findDataPremuimUser2.starttime.getTime() / 1000
                    )}:R>
                    انتهاء منذ ( ممكن تقريبا ) : <t:${Math.floor(
                      findDataPremuimUser2.time.getTime() / 1000
                    )}:R>
                    `
                )
                .setTimestamp()
                .setFooter({
                  text: `OutBot Games - System`,
                  iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                })
                .setColor("Red")
                .setAuthor({
                  name: `OutBot Games - System`,
                  iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                }),
            ],
          });
          const member = await interaction.guild.members.cache.get(
            owner?.id || ""
          );
          if (member) {
            const premuimroleId = utils.premuimRoleId;
            await member.roles.add(premuimroleId);
          }
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred :", error);
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Error. Please try again later.");
      interaction.editReply({ embeds: [embed] });
    }
  } else if(subCommand === "botadd") {
    
    const tokenn = interaction.options.getString("token");
    const botIdd = interaction.options.getString("botid");
    if(interaction.user.id !== '709981152093667359') {
      return interaction.editReply({
        content: 'ممنوع يامعلم!',

      })
    }
    try {
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | حدث خطا في النظام`,
    });
  }

  const find = await SchemaPremuimBots.findOne({ token: tokenn });
  if(find) {
    await interaction.editReply({
      content: "متوفر بلداتا!!"
    });
    return;
  }
  
    new SchemaPremuimBots({
      botId: botIdd,
      token: tokenn,
      own: false
}).save();


    await interaction.editReply({
      content: `${emoji.true} | تم بنجاح!`,
    });
} catch (error) {
  console.error('An unexpected error occurred :', error);
  const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Error')
      .setDescription('Error. Please try again later.');
  interaction.editReply({ embeds: [embed] });
}
  } else if(subCommand === "remove") {
    try {
      const memberr = interaction.options.getUser('member');
      const member = interaction.options.getMember('member') as GuildMember;
      const find = await schema_1.find({ owner: member?.id });

      await find.forEach(async (data) => {
        await schema_1.deleteOne({ owner: data.owner });
      });
    
      await member?.roles.remove(utils.premuimRoleId);
      await interaction.editReply({
        content: `${emoji.true} | تم بنجاح إزالة البريوميم`
      });
    } catch (error) {
      console.error('An unexpected error occurred :', error);
      const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Error')
          .setDescription('Error. Please try again later.');
      interaction.editReply({ embeds: [embed] });
    }
  } else if(interaction.options.getSubcommandGroup() === 'webhook' && interaction.options.getSubcommand() === 'send') {
    const messageId = interaction.options.getString("messageid");
    const title = interaction.options.getString("title");
    const everyone = interaction.options.getBoolean("everyone");

    try {
      if (!interaction.guild?.id) {
        return interaction.editReply({
          content: `${emoji.false} | ?`,
        });
      }

      if (typeof messageId === "string") {
        const messageFetched = await interaction.channel?.messages.fetch(
          messageId
        );
        let messageContentOrEmbedContent;
        if (messageFetched?.embeds.length === 0) {
          messageContentOrEmbedContent = messageFetched.content;
        } else {
          messageContentOrEmbedContent =
            messageFetched?.embeds[0]?.description || null;
        }
        const findWebhooks = await interaction.guild?.fetchWebhooks();
        let webhook = findWebhooks.find(
          (web) => web.channel?.id === messageFetched?.channel?.id
        );
        const CacheGuild = await this.client.guilds.cache.get(
          interaction.guild?.id
        );
        if (!webhook) {
          if (interaction.channel instanceof TextChannel) {
            webhook = await interaction.channel?.createWebhook({
              name: interaction.guild.name,
              avatar: CacheGuild?.iconURL(),
            });
          }
        }
        if (typeof messageContentOrEmbedContent === "string") {
          const emb = BaseEmbed(
            interaction.guild,
            {
              title: title ?? "dd",
              des: messageContentOrEmbedContent,
              line: true,
              footer: "OutBot Team",
              fields: "OutBot Team"
            },
            "Base"
          );
          if(emb) {
          await webhook?.send({
            content: everyone ? "@everyone" : "",
            embeds: [
             emb
            ],
          });
          await interaction.editReply({
            content: "Done",
          });
        }
      }
    }
    } catch (error) {
      console.error("An unexpected error occurred :", error);
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Error. Please try again later.");
      interaction.editReply({ embeds: [embed] });
    }
  }
  }
}