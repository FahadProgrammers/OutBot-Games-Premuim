import TicTacToe from "discord-tictactoe";
import {
  Message,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import { AIDifficulty } from "discord-tictactoe/dist/src/config/types";
import emoji from "../../utils/functions/emojis";

export default class xo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "اكس.او",
      description: "لعبه xo",
      category: Category.ثنائيه,
      cooldown: 3,
      aliases: ["اكس-او", "XO", "xo"],
    });
  }

  async execute(message: Message) {
    const args = await message.content.split(" ");
    let aiDifficulty: AIDifficulty;
    if (!message.mentions.members?.first()) {
      switch (args[1]) {
        case "سهل":
          aiDifficulty = "Easy";
          break;
        case "متوسط":
          aiDifficulty = "Medium";
          break;
        case "صعب":
          aiDifficulty = "Hard";
          break;
        case "صعب جدا":
          aiDifficulty = "Unbeatable";
          break;
        default:
          aiDifficulty = "Easy";
          break;
      }
    } else {
      aiDifficulty = "Easy";
    }

    const game = new TicTacToe({
      language: "ar",
      aiDifficulty: aiDifficulty ?? "Easy",
    });
    game.handleMessage(message);
  }
}
