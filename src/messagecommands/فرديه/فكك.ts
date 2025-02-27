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
import embedsuccess from "../../utils/embeds/BaseEmbed";
import randomwordSuccess from "../../utils/games/success";
import randomwords from "../../utils/games/splitwords.json";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import emoji from "../../utils/functions/emojis";
import path from "path";
import canvas, { loadImage } from "canvas";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";
import SchemaTheme from "../../schema/SchemaTheme";

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
      Object.keys(randomwords.words)[
        Math.floor(Math.random() * Object.keys(randomwords.words).length)
      ];
      const ran = randomwords.words;
    const randomValue = ran[randomKey as keyof typeof ran];
   const Canvas = canvas.createCanvas(700, 250);
    const ctx = Canvas.getContext("2d");
    const f = await SchemaTheme.findOne({
      guildId: message.guild?.id
    });
    let filePath = path.resolve("src/utils/assets", "BOTBG.png");

    if(f) {
      switch(f.theme) {
        case "1":
          filePath = path.resolve("src/utils/assets/Themes", "OutBot_Games_Background1.png")
        break;
        case "2":
          filePath = path.resolve("src/utils/assets/Themes", "OutBot_Games_Background2.png")
        break;
      }
    }
   
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
        ctx.fillText("اكتب الكلمه قبل إنتهاء الوقت", 165, 180);

        //Time
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        switch(f?.theme) {
          case "1":
            ctx.fillText("5", 60, 235);
            break;
          case "2":
            ctx.fillText("5", 43, 235);
            break;
        }

        //Word
        ctx.font = "25px ImageFont";
        ctx.fillStyle = "White";
        switch(f?.theme) {
        case "1":
        ctx.fillText(randomKey, 320, 115); // x 320
        break;
        case "2":
        ctx.fillText(randomKey, 265, 115); // x 320
        break;
      }
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
      await Collecter(this.client, messageFetch, randomValue, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
