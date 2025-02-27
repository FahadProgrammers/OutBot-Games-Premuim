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
import akinator from "discord.js-akinator"
import rank from "../../utils/functions/rank";
import schema from "../../schema/SchemaUsers";
import path from "path";
import emoji from "../../utils/functions/emojis";
import profile from "../../utils/functions/Profile";
import pschema from "../../schema/SchemaPrefix";
import Collecter from "../../utils/functions/MessageCollecter";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import canvas, { loadImage } from "canvas";
import { enable } from "colors";

export default class جمع extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "المارد",
      description: "لعبه المارد الازرق )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: [],
    });
  }

  async execute(message: Message) {
    try {

      akinator(message, {
        language: "ar",
        childMode: true,
        useButtons: true,
        embedColor: "Red",
        translationCaching: {
          enabled: false
        }
    });
} catch (err) {
      console.log("Error of Collecter!!");


    }
  }
}