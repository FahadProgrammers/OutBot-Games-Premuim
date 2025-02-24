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
import warningembed_1 from "../../utils/embeds/warnembed";
import path from "path";
import emoji from "../../utils/functions/emojis";
import profile from "../../utils/functions/Profile";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

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
    if (message.guild?.id === "711370689126596618")
      // Drb7h ServerId
      return;
    const randomKey =
      Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];
    const randomValue = word[randomKey];

    const ff = path.resolve("src/addition/assets/Youtubers", randomValue);
    const attach = new AttachmentBuilder(ff, { name: `image.png` });

    const messageFetch = await message.reply({
      files: [attach],
    });

    const time_1 = new Date().getTime();
    let status = false;
    try {
      await Collecter(messageFetch, randomValue, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
