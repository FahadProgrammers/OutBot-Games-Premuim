import {
  ButtonInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import mainembed from "../../../utils/embeds/mainEmbed";
import schema from "../../../schema/SchemaUsers";
import rank from "../../../utils/functions/rank";

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
    if (interaction.customId === `pall_${interaction.guild?.id}`) {
      await interaction.deferReply({
        ephemeral: true,
      });
      const schemaFindAll = await schema.find();

      const top10PointsAll = schemaFindAll
        .sort((a, b) => b.p - a.p)
        .map((entry, index) => {
          const rankDetails = rank(entry.p);
          if (index === 0) {
            /* top 1 */ return `:crown: ( ${entry.p} ) <@${entry.userId}>`;
          } else if (index === 1) {
            /* top 2 */ return `<:silvermedal3:1309923637846872094> ( ${entry.p} ) <@${entry.userId}>`;
          } else if (index === 2) {
            /* top 3 */ return `<:bronzemedal:1309923618322513922> ( ${entry.p} ) <@${entry.userId}>`;
          } else {
            return `#${index + 1} ( ${entry.p} ) <@${entry.userId}>`;
          }
        })
        .slice(0, 10)
        .join("\n");
      const emb = mainembed(
        top10PointsAll,
        "لاتسى قول ( ما شاء الله )",
        "لاتسى قول ( ما شاء الله )"
      );
      await interaction.editReply({
        embeds: [emb],
      });
    }
  }
}
