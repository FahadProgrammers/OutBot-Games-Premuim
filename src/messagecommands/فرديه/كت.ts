import { AttachmentBuilder, Message } from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import ktword from "../../utils/games/kt";
import canvas from "canvas";
import path from "path";

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

    const Canvas = canvas.createCanvas(700, 250);
    const ctx = Canvas.getContext("2d");
    const filePath = path.resolve("assets", "BOTBNGNOROBOT.png");
    const attach = new AttachmentBuilder(Canvas.toBuffer("image/png"), {
      name: "image.png",
    });

    await message.reply({
      content: randomword_2,
    });
  }
}
