import {
  AttachmentBuilder,
  Message,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import profile from "../../utils/functions/Profile";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "الملف الشخصي",
      description: "الملف الشخصي لك/لغيرك.",
      category: Category.ادمن,
      cooldown: 3,
      aliases: ["بروفايل", "معلوماتي"],
    });
  }
  async execute(message: Message) {
    if(!message.guild) return;

    const waitembed = await BaseEmbed(
      this.client,
      message.guild,
      {
        line: false,
        title: "يرجى الإنتضار...",
        footer: "Profile",
        fields: "Profile",
      },
      "Base"
    );
    if(waitembed) {
    const msg = await message.reply({
      embeds: [waitembed],
    });
  
    const profileembed = await BaseEmbed(
      this.client,
      message.guild,
      {
        line: false,
        title: "البروفايل الخاص بك.",
        footer: "Profile",
        fields: "Profile",
      },
      "Base"
    );
    let mention = message.mentions.users.first() || message.author;
   
    const profileBuffer = (await profile(message, mention)) as unknown as AttachmentBuilder;
    if(profileembed) {
    profileembed.setImage("attachment://file.jpg");
  
    await msg.edit({
      embeds: [profileembed],
      files: [profileBuffer],
    });
  }
}
}  
}