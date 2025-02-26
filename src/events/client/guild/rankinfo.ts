import {
  ButtonInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
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
    if (interaction.customId === "rank_info") {
      await interaction.deferReply({
        ephemeral: true,
      });
      if(!interaction.guild) return;
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          line: false,
          title: "Devices Theme | مظهر الاجهزه",
          footer: "Rank",
          des: `
            <:Arrow1:1299711671052402718> Devices Theme | مظهر الاجهزه
      
            <:emoji_7:1300911919410188288> **0** - لاعب جديد
            <:emoji_12:1300918782369337415> **50** - لاعب عادي
            <:emoji_9:1300913649589944330>  **100** - لاعب فنان
            <:emoji_11:1300914268585328761> **200** - لاعب رهيب
            <:emoji_10:1300914252605030512> **400** - لاعب محترف
            <:emoji_12:1300914637205667870> **600** - لاعب اسطوري
            <:king:1343372191487492127> **1000** - ملك الالعاب
          `,
          fields: "Rank"
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
