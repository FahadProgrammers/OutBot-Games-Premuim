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
import embedsuccess from "../../utils/embeds/BaseEmbed";
import randomwordSuccess from "../../utils/games/success";
import randomwords from "../../utils/games/splitwords";
import warningembed_1 from "../../utils/embeds/warnembed";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import emoji from "../../utils/functions/emojis";
import path from "path";
import canvas, { loadImage } from "canvas";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";

export default class فكك extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "فكك",
      description: "لعبه فكك ( اسرع تفكيك إجابه  )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: [],
    });
  }
  async execute(message: Message) {
    const randomKey =
      Object.keys(randomwords)[
        Math.floor(Math.random() * Object.keys(randomwords).length)
      ];
    const randomValue = randomwords[randomKey];
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
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        ctx.fillText("✧ فكك الكلمه قبل إنتهاء الوقت ✧", 165, 180);

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
      await Collecter(messageFetch, randomValue, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
