import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import word from "../../utils/games/jm3";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import warningembed_1 from "../../utils/embeds/warnembed";
import mainembedNodetils from "../../utils/embeds/mainembedNodetils";
import emoji from "../../utils/functions/emojis";
import canvas from "canvas";
import path from "path";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

export default class جمع extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "جمع",
      description: "لعبه جمع ( جمع الكلمه )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["تجميع"],
    });
  }

  async execute(message: Message) {
    const randomKey =
      Object.keys(word)[Math.floor(Math.random() * Object.keys(word).length)];
    const randomValue = word[randomKey];

    const Canvas = canvas.createCanvas(700, 250);
    const ctx = Canvas.getContext("2d");
    const filePath = path.resolve("assets", "BOTBG.png");
    await canvas
      .loadImage(filePath)
      .then(async (image) => {
        canvas.registerFont(path.resolve("assets", "imagefont.ttf"), {
          family: "ImageFont",
        });

        ctx.drawImage(image, 0, 0, Canvas.width, Canvas.height);
        //Text
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("✧ اجمع الكلمه قبل إنتهاء الوقت ✧", 165, 180);

        //Time
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("5", 60, 235);

        //Word
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText(randomKey, 320, 115); // x 350
      })
      .catch((err: any) => {
        console.log(err);
      });
    const messageFetch = await message.reply({
      files: [Canvas.toBuffer()],
    });

    const time_1 = Date.now();
    let status = false;
    try {
      await Collecter(messageFetch, randomKey, randomValue, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
