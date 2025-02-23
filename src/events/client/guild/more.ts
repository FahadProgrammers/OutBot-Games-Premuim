import {
  ButtonInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import mainembed from "../../../utils/embeds/mainEmbed";
import prefix from "../../../schema/SchemaPrefix";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (interaction.customId === `more_${interaction.guild?.id}`) {
      await interaction.deferReply({
        ephemeral: true,
      });
      const prefixFind = await prefix.findOne({
        guildId: interaction.guild?.id,
      });

      const emb = mainembed(
        `${prefixFind?.prefix.length === 1 ? "بادئة" : "بادئات"} البوت : **${
          prefixFind?.prefix.join(",") || "+"
        }**`,
        "System",
        "System"
      );
      await interaction.editReply({
        embeds: [emb],
      });
    }
  }
}
