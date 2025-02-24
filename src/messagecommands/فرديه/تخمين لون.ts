import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  Message,
  OmitPartialGroupDMChannel,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import word from "../../utils/games/color";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import { createCanvas } from "canvas";
import warningembed_1 from "../../utils/embeds/warnembed";
import emoji from "../../utils/functions/emojis";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class لون extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "لون",
      description: "تخمين لون ( لون النص )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["color"],
    });
  }

  async execute(message: Message) {
    try {
      const args = message.content.split(" ").slice(1);
      const randomKey =
        Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];
      let randomValue = word[randomKey];
      const randomKey2 =
        Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];
      let randomValue2 = word[randomKey2];
      while (randomValue === randomValue2) {
        randomValue2 = word[randomKey2];
      }
      const randomKey3 =
        Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];

      const canvas = createCanvas(114, 148);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = randomValue;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = randomValue2;
      ctx.font = "25px Cairo";
      ctx.shadowBlur = 21;
      ctx.fillText(randomKey3, /* 40 */ 35, 75);
      const attach = new AttachmentBuilder(canvas.toBuffer("image/png"), {
        name: "image.png",
      });
      if (!message.guild) return;
      const base = BaseEmbed(
        message.guild,
        {
          line: false,
          title: "خمن **لون النص**",
          footer: "تخمين اللون",
          fields: "تخمين اللون",
        },
        "Base"
      );
      if (base) {
        base.setImage("attachment://image.png");

        const messageFetch = await message.reply({
          embeds: [base],
          files: [attach],
        });

        const time_1 = new Date().getTime();
        let status = false;
        try {
          await Collecter(messageFetch, randomKey2, time_1);
        } catch (err) {
          console.log("Error of Collecter!!");
        }
      }
    } catch (err) {
      console.log(err, "In تخمين لون");
    }
  }
}
