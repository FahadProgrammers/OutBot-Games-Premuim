import {
  ActionRowBuilder,
  Base,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaCounter";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("counter")
        .setDescription("counter...")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
  .addSubcommand((command) => command
      .setName("add")
      .setDescription(`إعداد الروم الخاص ب لعبة العد.`)
      .addChannelOption((option) =>
                option
                  .setName("channel")
                  .setDescription("عين القناه المراد اختيارها")
                  .setRequired(true)
                  .addChannelTypes(ChannelType.GuildText)
      ),
    )
  .addSubcommand((command) => command
  .setName('delete')
  .setDescription(`إزالة الروم الخاص ب لعبة العد.`)
  .addStringOption((option) =>
    option
      .setName("remove")
      .setDescription("عين القناه المراد إزالتها")
      .setRequired(true)
      .setAutocomplete(true)
)
.addRoleOption((role) => role
.setName('admim')
.setDescription("تحديد رول مايتم مسح رسائله.")
.setRequired(false)
)
),
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand();
     await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }
    if(subCommand === "delete") {
      
    const Targetchannel = interaction.options.getString("remove");
    const data =
    (await schema_1.findOne({
      guildId: interaction.guild.id,
      channelId: Targetchannel
    })) || null;
    const emb2 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "حدث خطا!",
        des: `❌ تاكد من اختيار عنصر صحيح او متوفر بقاعده البيانات `,
        line: false,
        footer: "Error.",
        fields: "Error."
      },
      "Base"
    );

    if(emb2) {
    if (Targetchannel === "") {
      await interaction.editReply({
        embeds: [emb2],
      });
      return;
    }

    if (data && data.channelId) {
      await data?.deleteOne();
    }
    if(interaction.guild) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "deletecounter",
          des: `${emoji.true} تم حذف القناه <#${Targetchannel}>`,
          line: true,
          footer: `حذف قناه`,
          fields: `حذف قناه`,
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
} else if(subCommand === "add") {
    const channel = interaction.options.getChannel("channel") as TextChannel;
    const role = interaction.options.getRole('role');
    const schema_2 =
      (await schema_1.findOne({
        guildId: interaction.guild?.id,
      })) || null;
    const emb = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "setcounter",
        des: `${emoji.true} | تم بنجاح اضافه قناة لعبة العد`,
        line: true,
        footer: `#${channel.name}`,
        fields: `#${channel.name}`,
      },
      "Success"
    );
    if(emb) {
    const emb2 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
      des: `${emoji.false} | هاذي القناه مضافه بلفعل`,
      line: false,
      footer: 'Error.',
      fields: "Error."
      },
      "Error"
    );
    const emb2Full = await BaseEmbed(
      this.client,
      interaction.guild,
      {
      des: `
      ${emoji.false} | مهلا لقد وصلت الحد الاقصى ل القنوات **${schema_2?.channelId.length} **
      للمزيد اشترك في [النسخه المطوره](https://discord.com/channels/1198628254043607070/1256976756485652480) 
        `,
      line: false,
      footer: 'Error.',
      fields: "Error."
      },
      "Error"
    );
    if (schema_2 && emb2) {
      if (schema_2?.channelId.includes(channel.id)) {
        await interaction.editReply({
          embeds: [emb2],
        });
        return;
      }
      if (!channel.permissionsFor(interaction.client.user)?.has(["ViewChannel", "SendMessages"])) {
          const emb2Full =  await BaseEmbed(
            this.client,
            interaction.guild,
            {
            des: `⚠️ لا يمكنني رؤية هذه القناة أو الكتابة بها. تأكد من إعطائي الأذونات الصحيحة.`,
            line: false,
            footer: 'Error.',
            fields: "Error."
            },
            "Error"
          );
          if(emb2Full) {
    return await interaction.editReply({ embeds: [emb2Full] });
}
      }
      if(schema_2) {
      schema_2.channelId = channel.id.toString();
      if(role) {
        schema_2.roleId = role.id;
      }
      schema_2.count = 0;
      await schema_2?.save();
      await interaction.editReply({
        embeds: [emb],
      });
    } 
  } else {
    if (!channel.permissionsFor(interaction.client.user)?.has(["ViewChannel", "SendMessages"])) { 
    const emb2Full = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        des: `⚠️ لا يمكنني رؤية هذه القناة أو الكتابة بها. تأكد من إعطائي الأذونات الصحيحة.`,
      line: false,
      footer: 'Error.',
      fields: "Error."
      },
      "Error"
    );
    if(emb2Full) {
    return await interaction.editReply({ embeds: [emb2Full] });
}
    }
    if(role) {
      new schema_1({
        guildId: interaction.guild.id,
        channelId: channel.id,
        roleId: role.id
      }).save();

    } else {
      new schema_1({
        guildId: interaction.guild.id,
        channelId: channel.id,
      }).save();
    }

      await interaction.editReply({
        embeds: [emb],
      });
    }

    const message = await channel.send({
      content: `
      <:confetti_2:1343040164183674900> **تم بإذن الله تفعيل لعبة العد في هاذي القناه.**`,
      components: [],
    });
    if (message.guild.members.me?.permissions.has("ManageGuild")) {
      await message.pin();
    }
  }
  }
}
}
