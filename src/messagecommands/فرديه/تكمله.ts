import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import { Hercai } from "hercai";
import Category from "../../base/enums/Category";
import randomwordSuccess from "../../utils/games/success";
import randomwords from "../../utils/games/words.json";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import emoji from "../../utils/functions/emojis";
import canvas, { loadImage } from "canvas";
import path from "path";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

export default class اسرع extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "تكمله",
      description: " يعطيك بداية احرف ونت تكمل.",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["كلمات", "تكملة"],
    });
  }

  async execute(message: Message) {
    const wordsss = await randomwords.words;
    const randomword_2_2 =
      wordsss[Math.floor(Math.random() * randomwords.words.length)];
    const Canvas = canvas.createCanvas(700, 250);
    const ctx = Canvas.getContext("2d");
    const filePath = path.resolve("src/utils/assets", "BOTBG.png");

    await loadImage(filePath)
      .then(async (image) => {
        canvas.registerFont(
          path.resolve(
            "src/utils/assets/Fonts",
            "alfont_com_Wafeq-SemiBold.otf"
          ),
          {
            family: "ImageFont",
          }
        );

        ctx.drawImage(image, 0, 0, Canvas.width, Canvas.height);
        //Text
        ctx.font = "27px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("كمل الكلمه قبل إنتهاء الوقت", 165, 180);

        //Time
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("5", 60, 235);

        //Word
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText(randomword_2_2.length > 2 ? randomword_2_2.slice(0, -1) : "_", 320, 115); // x 350
      })
      .catch((err) => {
        console.log(err);
      });
    const messageFetch = await message.reply({
      files: [Canvas.toBuffer()],
    });

    const time_1 = Date.now();
    let status = false;

    try {
      await Collecter(this.client, messageFetch, randomword_2_2, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
