import {
  ActionRow,
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
import randomwordSuccess from "../../utils/games/success";
import randomwords from "../../utils/games/words.json";
import warningembed_1 from "../../utils/embeds/warnembed";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import emoji from "../../utils/functions/emojis";
import canvas, { loadImage } from "canvas";
import path from "path";
import profile from "../../utils/functions/Profile";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

export default class رتب extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "رتب",
      description: "لعبه رتب ( رتب الكلمه )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["ترتيب"],
    });
  }
  async execute(message: Message) {
    const randomKey =
      randomwords.words[Math.floor(Math.random() * randomwords.words.length)];
    const randomKeyWithrtb = randomKey.split("").reverse().join("");
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
        ctx.fillText("✧ رتب الكلمه قبل إنتهاء الوقت ✧", 165, 180);

        //Time
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("5", 60, 235);

        //Word
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText(randomKeyWithrtb, 320, 115); // x 350
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
      await Collecter(messageFetch, randomKeyWithrtb, randomKey, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
