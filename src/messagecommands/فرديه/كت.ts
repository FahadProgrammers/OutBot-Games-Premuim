import { AttachmentBuilder, Message } from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import ktword from "../../utils/games/kt";
import canvas, { loadImage } from "canvas";
import path from "path";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class كت extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "كت",
      description: "لعبه كت ( سؤال وجواب )",
      category: Category.فرديه,
      cooldown: 3,
      aliases: ["kt"],
    });
  }

  async execute(message: Message) {
    const randomword_1 = Math.floor(Math.random() * ktword.length);
    const randomword_2 = ktword[randomword_1];
    if (!message.guild) return;
    const base = BaseEmbed(
      message.guild,
      {
        des: `## ${randomword_2}`,
        line: false,
        footer: "كت",
        fields: "كت",
      },
      "Base"
    );
    if (base) {
      await message.reply({
        embeds: [base],
      });
    }
  }
}
