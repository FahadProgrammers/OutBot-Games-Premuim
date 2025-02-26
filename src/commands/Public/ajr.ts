import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaChannel";
import emoji from "../../utils/functions/emojis";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class ajr extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("ajr")
        .setDescription("اجر | جزاك الله خير"),
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

    const embed = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        line: false,
        title: `صدقة جاريه`,
        footer: "System",
        fields: `
          الله يرحمه ويغفر له ويغفر له ويسكنه فسيح جناته
    
          [تبرع الآن](https://ehsan.sa/campaign/1E29E00C61)
    
          عن أبي هُريرة رضي الله عنه : أَنَّ رسولَ اللَّه ﷺ قَالَ: مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ للَّهِ إِلَّا رَفَعَهُ اللّهُ عز وجل
        `,
      },
      "Base"
    );
    if(embed) {    

    await interaction.editReply({
      embeds: [
        embed
      ],
    });
  }
}
}