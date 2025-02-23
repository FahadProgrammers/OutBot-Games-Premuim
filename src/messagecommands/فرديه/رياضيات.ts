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
import word from "../../utils/games/youtubers";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import warningembed_1 from "../../utils/embeds/warnembed";
import mainembedNodetils from "../../utils/embeds/mainembedNodetils";
import path from "path";
import emoji from "../../utils/functions/emojis";
import numbersandkey from "../../utils/functions/randomNum";
import canvas, { loadImage } from "canvas";
import profile from "../../utils/functions/Profile";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

export default class رياضيات extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "رياضيات",
      description: "لعبه الرياضيات جمع او طرح او ضرب او قسمه",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["رقم"],
    });
  }

  async execute(message: Message) {
    const keys = numbersandkey();
    const num1 = keys.num1;
    const num2 = keys.num2;
    const key = keys.randomKey;
    let answer;

    switch (key) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      default:
        throw new Error("Invalid operation");
    }

    // message.reply({
    //     content: `${num1}${key.replace('*', "X")}${num2}?}`
    // })

    const Canvas = canvas.createCanvas(700, 250);
    const ctx = Canvas.getContext("2d");
    const filePath = path.resolve("assets", "BOTBG.png");
    await loadImage(filePath)
      .then(async (image) => {
        canvas.registerFont(path.resolve("assets", "imagefont.ttf"), {
          family: "ImageFont",
        });

        ctx.drawImage(image, 0, 0, Canvas.width, Canvas.height);
        //Text
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("✧ حل المعادله قبل إنتهاء الوقت ✧", 165, 180);

        //Time
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("5", 60, 235);

        //Word
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText(`${num1}${key.replace("*", "X")}${num2}?`, 320, 115); // x 10
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
      await Collecter(
        messageFetch,
        `${num1}${key.replace("*", "X")}${num2}`,
        answer.toString(),
        time_1
      );
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
