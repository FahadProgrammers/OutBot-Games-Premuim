import {
  ButtonInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import BaseEmbed from "../../../utils/embeds/BaseEmbed";
import prefix from "../../../schema/SchemaPrefix";
import e from "express";
import emoji from "../../../utils/functions/emojis";

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
        channelId: interaction.channel?.id,
      });

      if(!interaction.guild) {
        return console.log("خطا في interaction.guild")
      }
      const emb = BaseEmbed(
        interaction.guild,
        {
          title: `${prefixFind?.prefix.length === 1 ? "بادئة" : "بادئات"} **البوت**`,
          des: `
          <:blogging:1343040598919090236> **البريفكس** المخصصه لديك في هاذي القناه **هيَ**:
${emoji.open} **${prefixFind?.prefix.join(",") || "+"}** ${emoji.close}
          `,
          line: false,
          footer: "بيانات القناه",
          fields: "بيانات القناه"
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
