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
import mainembed from "../../utils/embeds/mainEmbed";
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
      await interaction.editReply({
        embeds: [
          mainembed(`${emoji.false} | تأكد من القناه!`, "System", "System"),
        ],
      });
      return;
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
      await interaction.editReply({
        embeds: [
          mainembed(
            `${emoji.false} | تأكد من الامر المختار!`,
            "System",
            "System"
          ),
        ],
      });
      return;
    }
    const findData = await schema_1.findOne({
      guildId: interaction.guild?.id,
      channelId: channel,
      roleId: role?.id,
      command: command,
    });
    if (findData) {
      await interaction.editReply({
        embeds: [
          mainembed(
            `${emoji.false} | متوفر بالبيانات بلفعل!`,
            "System",
            "System"
          ),
        ],
      });
      return;
    }

    new schema_1({
      guildId: interaction.guild?.id,
      channelId: channel,
      roleId: role?.id,
      command: command,
    }).save();
    await interaction.editReply({
      embeds: [
        mainembed(`${emoji.true} | تم بنجاح تنفيذ العمليه`, "System", "System"),
      ],
    });
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
        await interaction.editReply({
          embeds: [
            mainembed(`${emoji.false} | تأكد من القناه!`, "System", "System"),
          ],
        });
        return;
      }

      const findCommand = this.client.messagecommands.some(
        (command2) => command2.name === findChannel.command
      );

      if (
        !findCommand &&
        findChannel.command !== "one" &&
        findChannel.command !== "two" &&
        findChannel.command !== "all"
      ) {
        await interaction.editReply({
          embeds: [
            mainembed(
              `${emoji.false} | تأكد من الامر المختار!`,
              "System",
              "System"
            ),
          ],
        });
        return;
      }
      const findData = await schema_1.findOne({
        guildId: interaction.guild?.id,
        channelId: split[0],
        command: split[2],
      });
      if (!findData) {
        await interaction.editReply({
          embeds: [
            mainembed(
              `${emoji.false} | غير متوفر بالبيانات بلفعل!`,
              "System",
              "System"
            ),
          ],
        });
        return;
      }

      await schema_1.deleteOne({
        guildId: interaction.guild?.id,
        channelId: split[0],
        command: split[2],
      });
      await interaction.editReply({
        embeds: [
          mainembed(
            `${emoji.true} | تم بنجاح تنفيذ العمليه`,
            "System",
            "System"
          ),
        ],
      });
    }
  } else if(subCommand === "control") {

    const command = interaction.options.getString('command-select');
    const disabled = interaction.options.getBoolean('disabled');
    let find = await SchemaControl.findOne({
      guildId: interaction.guildId,
    });


    if(disabled && command) {
      find = await SchemaControl.findOne({
        guildId: interaction.guildId,
      });  
      if(find?.command.includes(command)) {
      const BaseEmbed1 = BaseEmbed(
        interaction.guild,
        {
          title: "مهلا",
          des: "الأمر بلفعل مغلق",
          line: true,
          footer: "Error.",
          fields: "Error."
        },
        "Error"
      );

      if(BaseEmbed1) {
        return interaction.editReply({
          embeds: [BaseEmbed1]
        });
      }
    } else {
      if(find) {
         find.command.push(command);
         await find.save();
      } else {
      new SchemaControl({
        guildId: interaction.guildId,
        command: []
      }).save();
    }
  }

  const BaseEmbed11 = BaseEmbed(
    interaction.guild,
    {
      title: "تم بنجاح!",
      des: `${emoji.true} | **تم بنجاح **تعطيل الأمر`,
      line: true,
      footer: "Error.",
      fields: "Error."
    },
    "Base"
  );
  if(BaseEmbed11) {
    return interaction.editReply({
      embeds: [BaseEmbed11]
    });
  }
    } else {
    if(!find) {
      const BaseEmbed1 = BaseEmbed(
        interaction.guild,
        {
          title: "مهلا",
          des: "الأمر** غير **مفعل** ل إغلاقه**",
          line: true,
          footer: "Error.",
          fields: "Error."
        },
        "Error"
      );
      if(BaseEmbed1) {
        return interaction.editReply({
          embeds: [BaseEmbed1]
        });
      }
    } else {
      await find.deleteOne();
      const BaseEmbed11 = BaseEmbed(
        interaction.guild,
        {
          title: "حدث خطأ!",
          des: `${emoji.true} | **تم بنجاح إعادة **تشغيل الأمر`,
          line: true,
          footer: "Error.",
          fields: "Error."
        },
        "Base"
      );
      if(BaseEmbed11) {
        return interaction.editReply({
          embeds: [BaseEmbed11]
        });
      }
    }
    }
  }
}
}
