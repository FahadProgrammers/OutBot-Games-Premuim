import {
  ActionRowBuilder,
  Base,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import word from "../../utils/games/words.jm3.json";
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import emoji from "../../utils/functions/emojis";
import canvas, { loadImage } from "canvas";
import path from "path";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";
import SchemaTheme from "../../schema/SchemaTheme";

export default class مفرد extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "مفرد",
      description: "لعبه مفرد ( مفرد الكلمه )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["فرد"],
    });
  }

  async execute(message: Message) {
    const randomKey = Object.keys(word.words)[
      Math.floor(Math.random() * Object.keys(word.words).length)
    ];
    const randomValue = word.words[randomKey as keyof typeof word.words];

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
                       default:
                       ctx.fillText("5", 60, 235);
                       break;
                   }
           
                   //Word
                   ctx.font = "25px ImageFont";
                   ctx.fillStyle = "White";
                   switch(f?.theme) {
                   case "1":
                   ctx.fillText(randomValue, 320, 115); // x 320
                   break;
                   case "2":
                   ctx.fillText(randomValue, 265, 115); // x 320
                   break;
                   default:
                   ctx.fillText(randomValue, 320, 115); // x 320
                   break;
                 }
               })
                 .catch((err) => {
                   console.log(err);
                 });
if(!message.guild) return;
    const base = await BaseEmbed(
      this.client,
      message.guild,
      {
        line: false,
        title: "✧ لعبة المفرد ✧",
        footer: "مفرد الكلمة",
        fields: `حاول إيجاد المفرد الصحيح لكلمة: **${randomValue}**`,
      },
      "Base"
    );
    if(base) {

    const messageFetch = await message.reply({
      files: [Canvas.toBuffer()],
      embeds: [base],
    });
  
    const time_1 = Date.now();
    let status = false;
    try {
      await Collecter(this.client, messageFetch, randomKey, time_1);
    } catch (err) {
      console.log("Error of Collecter!!");
    }
  }
}
}
