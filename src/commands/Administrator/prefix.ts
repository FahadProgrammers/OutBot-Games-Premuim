import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaPrefix";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";

export default class prefix extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("prefix...")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommand((command) => command.setName('add').setDescription(`إعداد بريفكس روم الألعاب`)
        .addStringOption((option) =>
          option
            .setName("channel")
            .setDescription("اختار قناه البادئه المراد اضافتها")
            .setRequired(true)
            .setAutocomplete(true)
          )
        .addStringOption((option) =>
          option
            .setName("prefix")
            .setDescription("اختار البادئه المراد اضافتها")
            .setRequired(true)
        ))
        .addSubcommand((command) => command
.setName('remove')
.setDescription('إزالة بريفكس روم الألعاب')
.addStringOption((option) =>
  option
    .setName("delprefix")
    .setDescription("اختار قناه البادئه المراد ازالتها")
    .setRequired(true)
    .setAutocomplete(true)
))
        ,
        
      
      category: Category.ادمن,
      cooldown: 0,
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
    try {
    const { options } = interaction;
    const subCommand = interaction.options.getSubcommand();
    if(subCommand === "remove") {
    const prefix = options.getString("delprefix");
    const prefixx = prefix?.split("_");
    
    if(interaction.guild && prefixx) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "deleteprefix",
          des: `${emoji.true} | تم بنجاح إزالة البادئه ( \` ${prefixx[0]} \` )`,
          line: true,
          footer: `حذف بادئه`,
          fields: `حذف بادئه`,
        },
        "Success"
      );
      if(emb) {
    const embnotfound = await BaseEmbed(
      this.client,
      interaction.guild,
      {
      des: `${emoji.false} | لا اتمكن من العثور بلفعل على بادئه مخصصه`,
      line: false,
      footer: "Error.",
      fields: "Error.",
      },
      "Erorr"
    );
    if(embnotfound) {
    await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }
    if (prefixx) {

      let f =
        (await schema_1.findOne({
          guildId: interaction.guild.id,
         channelId: prefixx[1],
        })) || null;
      const find = f?.prefix.find((data) => data === prefixx[0]);
      if (f && find) {
          f.prefix = f.prefix.filter((channelId) => channelId !== prefixx[0]);
          await f?.save();  
          if(f.prefix.length === 0) {
            console.log("فاضي")
            f.deleteOne();
          }
      } else {
        await interaction.editReply({
          embeds: [embnotfound],
        });
        return;
      }

      await interaction.editReply({
        embeds: [emb],
      });
    }
  }
}
}
    
  } else if(subCommand === "add") {
    const prefix = options.getString("prefix");
    const channel = options.getString('channel');
    if(channel) {
    if(interaction.guild) {
    const emb = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "setprefix",
        des: `${emoji.true} | تم بنجاح تعيين البادئه ( \` ${prefix} \` )`,
        line: false,
        footer: "تعيين البادئه",
        fields: "تعيين البادئه"
      },
      "Success"
    );

    await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }

    const f =
      await schema_1.findOne({
        guildId: interaction.guild.id,
        channelId: channel,
      })
    if (!f) {
      new schema_1({
        guildId: interaction.guild?.id,
        channelId: channel,
        prefix: [prefix],
      }).save();
    } else {
      if (prefix) {
       f.prefix.push(prefix);
        await f.save();
      }
    }
    if(emb) {
    await interaction.editReply({
      embeds: [emb],
    });
  }
  }
}
  }
} catch(err) {
  console.log(err)
}
  }
}
