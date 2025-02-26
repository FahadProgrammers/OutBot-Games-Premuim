import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaEvent";
import schema_2 from "../../schema/SchemaChannel";
import SchemaControl from "../../schema/SchemaCommandControl";
import emoji from "../../utils/functions/emojis";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("command")
        .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommand((command) => command
      .setName('control')
      .setDescription("تعطيل/تشغيل الأمر المخصص.")
      .addStringOption((command) => command
    .setName('command-select')
    .setDescription("اختر الامر")
    .setAutocomplete(true)
    .setRequired(true)
    )
    .addBooleanOption((command) => command
  .setName('disabled')
.setDescription('تشغيل/إطفاء')
.setRequired(true)
)
    )
        .addSubcommandGroup((command) => command
        .setName('role')
        .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
        .addSubcommand((commandd) => commandd
      .setName('remove')
      .setDescription(`إزالة الرتبه الخاصه الى الأوامر.`)
      .addStringOption((option) =>
        option
          .setName("select")
          .setDescription("عين الاختيارات المراد ازالتها")
          .setRequired(true)
          .setAutocomplete(true)
      ),
      )
        .addSubcommand((commanddd) => commanddd
        .setName('add')
        .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
    
        .addStringOption((option) =>
          option
            .setName("channel")
            .setDescription("عين القناه المراد اختيارها")
            .setRequired(true)
            .setAutocomplete(true)
        )

        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("عين الرتبه المراد اختيارها")
            .setRequired(true)
        )

        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("عين الامر المراد اختياره")
            .setRequired(true)
            .setAutocomplete(true)
        )
      )
    )
  

    ,
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }
    const subCommand =  interaction.options.getSubcommand();
    if(subCommand === "add") {
    const channel = interaction.options.getString("channel");
    const role = interaction.options.getRole("role");
    const command = interaction.options.getString("command");
    const findChannel = await schema_2.findOne({
      channelId: channel,
      guildId: interaction.guild?.id,
    });
    if (!findChannel) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "خطأ",
          des: `${emoji.false} | تأكد من القناة!`,
          line: true,
          footer: "Error",
          fields: "لا يوجد سجل لهذه القناة",
        },
        "Error"
      );
      if(emb) {
      return interaction.editReply({
        embeds: [emb],
      });
    }
    }

    const findCommand = this.client.messagecommands.some(
      (command2) => command2.name === command
    );

    if (
      !findCommand &&
      command !== "one" &&
      command !== "two" &&
      command !== "all"
    ) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "خطأ",
          des: `${emoji.false} | تأكد من الامر المختار!`,
          line: true,
          footer: "Error",
          fields: "الأمر غير موجود أو غير صالح",
        },
        "Error"
      );
      if(emb) {
      return interaction.editReply({
        embeds: [emb],
      });
    }
    }

    const findData = await schema_1.findOne({
      guildId: interaction.guild?.id,
      channelId: channel,
      roleId: role?.id,
      command: command,
    });
    if (findData) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "خطأ",
          des: `${emoji.false} | هذا السجل موجود بالفعل!`,
          line: true,
          footer: "Error",
          fields: "السجل موجود في البيانات مسبقًا",
        },
        "Error"
      );
      if(emb) {
      return interaction.editReply({
        embeds: [emb],
      });
    }
    }

    new schema_1({
      guildId: interaction.guild?.id,
      channelId: channel,
      roleId: role?.id,
      command: command,
    }).save();
    const emb = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "نجاح",
        des: `${emoji.true} | تم بنجاح تنفيذ العملية`,
        line: true,
        footer: "Success",
        fields: "تم إضافة السجل بنجاح",
      },
      "Success"
    );
    if(emb) {
    await interaction.editReply({
      embeds: [emb],
    });
  }
  } else if(subCommand === "remove") {
    const select_1 = interaction.options.getString("select");
    const split = select_1?.split("_");
    if (split) {
      const findChannel = await schema_1.findOne({
        channelId: split[0],
        roleId: split[1],
        command: split[2],
        guildId: interaction.guild?.id,
      });
      if (!findChannel) {
        const emb = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "خطأ",
            des: `${emoji.false} | تأكد من القناة!`,
            line: true,
            footer: "Error",
            fields: "القناة غير موجودة في البيانات",
          },
          "Error"
        );
        if(emb) {
        return interaction.editReply({
          embeds: [emb],
        });
      }
      }

      
      const findCommand = this.client.messagecommands.some(
        (command2) => command2.name === findChannel?.command
      );

      if (
        !findCommand &&
        findChannel?.command !== "one" &&
        findChannel?.command !== "two" &&
        findChannel?.command !== "all"
      ) {
        const emb = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "خطأ",
            des: `${emoji.false} | تأكد من الأمر المختار!`,
            line: true,
            footer: "Error",
            fields: "الأمر غير صالح",
          },
          "Error"
        );
        if(emb) {
        return interaction.editReply({
          embeds: [emb],
        });
      }
    }

      await schema_1.deleteOne({
        guildId: interaction.guild?.id,
        channelId: split[0],
        command: split[2],
      });
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "نجاح",
          des: `${emoji.true} | تم بنجاح تنفيذ العملية`,
          line: true,
          footer: "Success",
          fields: "تم إزالة السجل بنجاح",
        },
        "Success"
      );
      if(emb) {
      await interaction.editReply({
        embeds: [emb],
      });
    }
  }
  }
}
}
