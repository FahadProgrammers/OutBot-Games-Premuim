import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import word from "../../utils/games/youtubers";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import path from "path";
import emoji from "../../utils/functions/emojis";
import profile from "../../utils/functions/Profile";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import canvas, { loadImage } from "canvas";

export default class جمع extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "خمن اليوتيوبر",
      description: "لعبه خمن اليوتيوبر ( من صورته )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["يوتيوبر", "يوتيوبرز"],
    });
  }

  async execute(message: Message) {
    const randomKey =
      Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];
    const randomValue = word[randomKey];

    const ff = path.resolve("src/utils/Youtubers", randomValue);
    const attach = new AttachmentBuilder(ff, { name: `image.png` });


    if (!message.guild) return;
      const base = await BaseEmbed(
        this.client,
        message.guild,
        {
          line: false,
          title: "خمن **لون اليوتيوبر**",
          footer: "تخمين اليوتيوبر",
          fields: "تخمين اليوتيوبر",
        },
        "Base"
      );
      if (base) {
       base.setImage('attachment://image.png')
    const messageFetch = await message.reply({
      embeds: [base],
      files: [attach],
    });

    const time_1 = new Date().getTime();
    let status = false;
    try {
      await Collecter(this.client, messageFetch, randomKey, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
}
