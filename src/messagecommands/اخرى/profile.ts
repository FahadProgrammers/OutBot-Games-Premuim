import {
  AttachmentBuilder,
  Message,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import profile from "../../utils/functions/Profile";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "profile",
      description: "إضهار المعلومات",
      category: Category.ادمن,
      cooldown: 3,
      aliases: ["بروفايل"],
    });
  }
  async execute(message: Message) {
    const waitembed = mainembed("يرجى الإنتضار...", "Profile", "Profile");
    const msg = await message.reply({
      embeds: [waitembed],
    });

    const profileembed = mainembed("البروفايل الخاص بك.", "Profile", "Profile");
    const profileBuffer = (await profile(
      message
    )) as unknown as AttachmentBuilder;
    profileembed.setImage("attachment://file.jpg");

    await msg.edit({
      embeds: [profileembed],
      files: [profileBuffer],
    });
  }
}
