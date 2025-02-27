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
  import randomwordSuccess from "../../utils/games/success";
  import randomwords from "../../utils/games/qs_football.json";
  import rank from "../../utils/functions/rank";
  import schema from "../../schema/SchemaUsers";
  import emoji from "../../utils/functions/emojis";
  import canvas, { loadImage } from "canvas";
  import path from "path";
  import pschema from "../../schema/SchemaPrefix";
  import Collecter from "../../utils/functions/MessageCollecter";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
  
  export default class football extends Command {
    constructor(client: CustomClient) {
      super(client, {
        name: "كوره",
        description: "اسئله في عالم الكوره.",
        category: Category.فرديه,
        cooldown: 3,
        aliases: ["football", "اسئله كرويه", "أسئله كرويه"],
      });
    }
  
    async execute(message: Message) {
      const randomword_1_1 = Math.floor(Math.random() * randomwordSuccess.length);
      const randomword_1_2 = randomwordSuccess[randomword_1_1];
      const randomKey2 =
        Object.keys(randomwords.words)[Math.floor(Math.random() * Object.keys(randomwords.words).length)];
      let randomword_2_2 = randomwords.words[randomKey2 as keyof typeof randomwords.words];
    
          if (!message.guild) return;
            const base = await BaseEmbed(
              this.client,
              message.guild,
              {
                line: false,
                des: "##"+ randomword_2_2.qs,
                title: "**اسئله** كرويه ⚽",
                footer: "⚽",
                fields: "⚽",
              },
              "Base"
            );

            if (base) {
          const messageFetch = await message.reply({
            embeds: [base]
          });
   
      const time_1 = Date.now();
      let status = false;
  
      try {
        await Collecter(this.client, messageFetch, randomword_2_2.jwab, time_1);
      } catch (err) {
        console.log("Error of Collecter!!");
      
      }
    }
    }
  }
  