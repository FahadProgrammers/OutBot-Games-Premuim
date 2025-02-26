import {
    ActionRowBuilder,
    Base,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
  } from "discord.js";
  import Command from "../../base/classes/Command";
  import CustomClient from "../../base/classes/CustomClient";
  import Category from "../../base/enums/Category";
  import schema_1 from "../../schema/SchemaChannel";
  import emoji from "../../utils/functions/emojis";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import utils from "../../utils/utils";
  
  export default class ajr extends Command {
    constructor(client: CustomClient) {
      super(client, {
        data: new SlashCommandBuilder()
          .setName("suppprt")
          .setDescription("رابط الدعم الفني")
          .addSubcommand((command) => command
        .setName('server')
        .setDescription("رابط الدعم الفني")
    ),
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
const Embd = await BaseEmbed(
  this.client,
    interaction.guild,
    {
      title: "Support Server",
      des: `
<:1323739617790263326:1341704260483551323> [الدعم الفني](${utils.SupportServer})
`,
      line: false,
      footer: "Support",
      fields: "Support"
    },
    "Base"
  );
  if(Embd) {
    const btn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setLabel('الدعم الفني')
        .setStyle(ButtonStyle.Link)
        .setURL(utils.SupportServer)
    )
      await interaction.editReply({
        embeds: [Embd],
        components: [btn]
    });
    }
  }
}