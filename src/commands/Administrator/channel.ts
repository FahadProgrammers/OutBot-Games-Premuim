import {
  ActionRowBuilder,
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
import mainembed from "../../utils/embeds/mainEmbed";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";
import warnembed from "../../utils/embeds/warnembed";

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
    const emb2 = mainembed(
      `❌ تاكد من اختيار عنصر صحيح او متوفر بقاعده البيانات `,
      `System`,
      `System`
    );

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
      const emb = BaseEmbed(
        interaction.guild,
        {
          title: "deletechannel",
          des: `${emoji.true} تم حذف القناه ( \`${Targetchannel} \` )`,
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
  } else if(subCommand === "add") {
    const channel = interaction.options.getChannel("channel") as TextChannel;
    const schema_2 =
      (await schema_1.findOne({
        guildId: interaction.guild?.id,
      })) || null;
    const emb = BaseEmbed(
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
    const emb2 = warnembed(
      `${emoji.false} | هاذي القناه مضافه بلفعل`,
      `Error Channel`,
      `Error Channel`
    );
    const emb2Full = warnembed(
      `
        ${emoji.false} | مهلا لقد وصلت الحد الاقصى ل القنوات **${schema_2?.channelId.length} **
        للمزيد اشترك في [النسخه المطوره](https://discord.com/channels/1198628254043607070/1256976756485652480) 
          `,
      `Full Channels`,
      `Full Channels`
    );
    if (schema_2) {
      if (schema_2?.channelId.length === 2) {
        await interaction.editReply({
          embeds: [emb2Full],
        });
        return;
      }
      if (schema_2?.channelId.includes(channel.id)) {
        await interaction.editReply({
          embeds: [emb2],
        });
        return;
      }
      schema_2?.channelId.push(channel.id);
      await schema_2?.save();
      await interaction.editReply({
        embeds: [emb],
      });
    } else {
      new schema_1({
        guildId: interaction.guild.id,
        channelId: [],
      }).save();

      const schema_3 = await schema_1.findOne({
        guildId: interaction.guild.id,
      });
      schema_3?.channelId.push(channel.id);
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
      content: `🎉 **تم بإذن الله تفعيل البوت في هاذي القناه.**
**سيتم تنزيل رساله للتحديثات الجديده ل اغلاقها**
<:Arrow1:1299711671052402718> /update status status: off`,
      components: [ActionRowBuilderPrefix],
    });
    if (message.guild.members.me?.permissions.has("ManageGuild")) {
      await message.pin();
    }
  }
  }
}
}
