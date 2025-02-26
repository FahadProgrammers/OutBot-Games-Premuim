import {
  ButtonInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import schema from "../../../schema/SchemaServerUsedStats";
import rank from "../../../utils/functions/rank";
import BaseEmbed from "../../../utils/embeds/BaseEmbed";

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
    if (interaction.customId === `serverused_${interaction.guild?.id}`) {
      await interaction.deferReply({
        ephemeral: true,
      });
      const schemaFindAll = await schema.find();

      const top10PointsAll = Promise.all(
schemaFindAll
        .sort((a, b) => b.statsall - a.statsall)
        .slice(0, 10)
        .map(async(entry, index) => {
          const guild = this.client.guilds.cache.get(entry.guildId);
          if (index === 0) {
            /* top 1 */ return `:crown: ${guild?.name} <:file:1341703206127931498> ${entry.statsall} مرّه.`;
          } else if (index === 1) {
            /* top 2 */ return `<:silvermedal3:1309923637846872094> ${guild?.name} <:file:1341703206127931498> ${entry.statsall} مرّه.`;
          } else if (index === 2) {
            /* top 3 */ return `<:bronzemedal:1309923618322513922> ${guild?.name} <:file:1341703206127931498> ${entry.statsall} مرّه.`;
          } else {
            return `#${index + 1} ${guild?.name} <:file:1341703206127931498> ${entry.statsall} مرّه.`;
          }
        })
      );
        
        if(!interaction.guild) return;
              
        const emb = await BaseEmbed(
          this.client,
        interaction.guild,
        {
        des: (await top10PointsAll).join("\n"),
        line: true,
        footer: "التوب",
        fields: "التوب",
        },
        "Base"
      );
      if(emb) {
      await interaction.editReply({
        embeds: [emb],
      });
    }
    }
  }
}
