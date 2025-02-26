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
import schema_1 from "../../schema/SchemaChannel";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("channel...")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
  .addSubcommand((command) => command
      .setName("add")
      .setDescription(`إعداد الروم الخاص ب الالعاب.`)
      .addChannelOption((option) =>
                option
                  .setName("channel")
                  .setDescription("عين القناه المراد اختيارها")
                  .setRequired(true)
                  .addChannelTypes(ChannelType.GuildText)
      ),
    )
  .addSubcommand((command) => command
  .setName('remove')
  .setDescription(`إزالة الروم الخاص ب الالعاب.`)
  .addStringOption((option) =>
    option
      .setName("remove")
      .setDescription("عين القناه المراد إزالتها")
      .setRequired(true)
      .setAutocomplete(true)
)),
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
    if(subCommand === "remove") {
    const data =
      (await schema_1.findOne({
        guildId: interaction.guild.id,
      })) || null;
    const Targetchannel = interaction.options.getString("remove");
    const find = data?.channelId.find((data) => data === Targetchannel);
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
    if (Targetchannel === "" || !find) {
      await interaction.editReply({
        embeds: [emb2],
      });
      return;
    }
    if (data && data.channelId) {
      data.channelId = data.channelId.filter((channelId) => channelId !== find);
      await data?.save();
    }
    if(interaction.guild) {
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "deletechannel",
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
    const schema_2 =
      (await schema_1.findOne({
        guildId: interaction.guild?.id,
      })) || null;
    const emb = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "setchannel",
        des: `${emoji.true} | تم بنجاح اضافه القناه`,
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
      schema_2?.channelId.push(channel.id);
      schema_2.dateend = new Date();
      await schema_2?.save();
      await interaction.editReply({
        embeds: [emb],
      });
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

      new schema_1({
        guildId: interaction.guild.id,
        channelId: [],
        date: new Date(),
        dateend: new Date()
      }).save();

      const schema_3 = await schema_1.findOne({
        guildId: interaction.guild.id,
      });
      schema_3?.channelId.push(channel.id);
      if (schema_3) {
        schema_3.dateend = new Date();
      }
      await schema_3?.save();
      await interaction.editReply({
        embeds: [emb],
      });
    }
    const ActionRowBuilderPrefix =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji("<:menu:1315236684832440320>")
          .setCustomId(`more_${interaction.guild.id}`)
          .setStyle(ButtonStyle.Secondary)
      );
    const message = await channel.send({
      content: `
      <:confetti_2:1343040164183674900>  **تم بإذن الله تفعيل البوت في هاذي القناه.**
<:1336961650103947294:1343044829055160423>  **سيتم تنزيل رساله للتحديثات الجديده ل اغلاقها أستخدم:**
${emoji.emen_arrow} **/**update status status: off`,
      components: [ActionRowBuilderPrefix],
    });
    if (message.guild.members.me?.permissions.has("ManageGuild")) {
      await message.pin();
    }
  }
  }
}
}
