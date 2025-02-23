import {
  ActionRowBuilder,
  Message,
  MessageComponentInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "help",
      description: "طلب مساعده",
      category: Category.ادمن,
      cooldown: 3,
      aliases: ["العاب", "مساعده", "مساعدة"],
    });
  }
  async execute(message: Message) {
    if(message.guild) {
    const Embed = BaseEmbed(
      message.guild,
      {
        title: "قائمة الاوامر", 
        des:
      `
      <:Picsart_241028_170653120:1303325780704759868> - **قائمة الاوامر**:

<:premuim:1341414399696703549>  يمكنك **الاختيار** من القائمه أدناه للحصول على **المطلوب**.

1 - <:0_:1341414321955278868> الالعاب الفرديه
2 - <:0_:1341414321955278868> الالعاب الثنائيه
3 - <:0_:1341414321955278868> الالعاب الجماعيه
4 - <:0_:1341414321955278868> اوامر السلاش
5 - <:all_2:1341693257062813746> الكل

`,
line: true,
footer: "Help Menu",
fields: "Help Menu",
      }, 
      "Base",
      
    );

    const actionrow = new ActionRowBuilder<StringSelectMenuBuilder>();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("starter")
      .setPlaceholder("قائمة الاوامر");

    Object.keys(Category).forEach((key) => {
      if (key === Category.Dev) return;
      let name;

      if(key === "فرديه") { 
        name = "الألعاب الفرديه" 
      } 
     else if(key === "ثنائيه") {
       name = "الألعاب الثنائيه" 
      } 
      else if(key === "مجموعه") { 
        name = "الألعاب الجماعيه"
       } 
      else if(key === "ادمن") {
           name = "اوامر السلاش"
       } else { 
        name = "حدث خطأ" 
      };

      if(name) {
      selectMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(name)
          .setValue(key)
          .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
      );
    }

    });
    selectMenu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("الكل")
        .setValue("all")
        .setEmoji("<:all_2:1341693257062813746>")
    );
    actionrow.addComponents(selectMenu);
    if(Embed) {
    await message.reply({
      embeds: [Embed],
      components: [actionrow],
    });
  }
  }
}
}
