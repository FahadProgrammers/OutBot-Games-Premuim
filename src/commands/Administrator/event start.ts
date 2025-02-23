import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";

export default class event extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("event")
        .setDescription(`بدء تشغيل الالعاب المتوصله مع اختيار الأوامر.`)
      .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommand((command) => command 
      .setName('start')
      .setDescription(`بدء تشغيل الالعاب المتوصله مع اختيار 
الأوامر.`)
        .addChannelOption((channel) =>
          channel
            .setName("channel")
            .setDescription("قناة بدء اللعبه")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        ))

        ,
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const channelId =
        (await interaction.options.getChannel("channel")?.id) ||
        interaction.channel?.id;

      await interaction.deferReply({
        ephemeral: true,
      });

      await interaction.editReply({
        content: "Waiting...",
      });

      const commands = await this.client.messagecommands;
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      let currentRow = new ActionRowBuilder<ButtonBuilder>();

      const cancel = new ButtonBuilder()
        .setCustomId(`cancel_${channelId}`)
        .setLabel("إلغاء")
        .setStyle(ButtonStyle.Danger);
      const okay = new ButtonBuilder()
        .setCustomId(`okay_${channelId}`)
        .setLabel("تأكيد")
        .setStyle(ButtonStyle.Success);

      currentRow.addComponents(cancel, okay);
      commands.forEach((command, key) => {
        if (command.category === Category.ادمن) return;
        const button = new ButtonBuilder()
          .setCustomId(`buttonn_${command.name}_${channelId}`)
          .setLabel(command.name || key)
          .setStyle(ButtonStyle.Secondary);

        currentRow.addComponents(button);

        if (currentRow.components.length === 5) {
          rows.push(currentRow);
          currentRow = new ActionRowBuilder<ButtonBuilder>();
        }
      });

      if (currentRow.components.length > 0) {
        rows.push(currentRow);
      }

      if (!interaction.guild?.id) {
        return interaction.editReply({
          content: "❌ | حدث خطأ في تحديد الخادم.",
        });
      }

      const embed = await mainembed("يرجى الاختيار ماتريد من الالعاب أدناه");
      embed.addFields({
        name: `تم إضافة:`,
        value: `لايوجد`,
      });
      await interaction.editReply({
        content: "OutBot Games",
        embeds: [embed],
        components: rows,
      });
    } catch (error) {
      console.error(
        "An unexpected error occurred : of command /push alert",
        error
      );
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Error. Please try again later.");
      interaction.editReply({ embeds: [embed] });
    }
  }
}
