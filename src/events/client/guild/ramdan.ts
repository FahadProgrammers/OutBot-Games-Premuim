import {
  ButtonInteraction,
  EmbedBuilder,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import BaseEmbed from "../../../utils/embeds/BaseEmbed";
import prefix from "../../../schema/SchemaPrefix";
import e from "express";
import emoji from "../../../utils/functions/emojis";
import RamdanXP from "../../../schema/RamdanXP";
import SchemaUsers from "../../../schema/SchemaUsers";

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
    if (interaction.customId === `ramdan`) {
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
      const emb = new EmbedBuilder()
      .setDescription(`🫡 | **تحيه لك**، خذ **دبل نقاط** لين حوالي نهاية رمضان مع **50** نقطه, جزاك الله خيرا.`)
      .setColor("Red")
      if(emb) {

      const f = await RamdanXP.findOne({
        guildId: interaction.guild.id,
        userId: interaction.user.id
      });
      if(f) {
        await interaction.editReply({
          content: ":eyes: | كشفتك!"
        })
      } else {
        new RamdanXP({
          guildId: interaction.guild.id,
          userId: interaction.user.id
        }).save();
        const f2 = await SchemaUsers.findOne({
          guildId: interaction.guild?.id,
          userId: interaction.user.id
        });
        if(f2) {
         f2.p += 50;
          await f2.save();
        } else {
          new SchemaUsers({
            guildId: interaction.guild?.id,
            userId: interaction.user.id,
            p: 50
          }).save();
        }
        await interaction.editReply({
          embeds: [emb],
        });
      }
    }
  }
  }
}
