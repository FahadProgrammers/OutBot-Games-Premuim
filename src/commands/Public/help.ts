import {
  ActionRowBuilder,
  Base,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import emoji from "../../utils/functions/emojis";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("معرفة الاوامر المخصصه."),
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }

    const Embed = BaseEmbed(
      interaction.guild,
      {
        title: "قائمة الاوامر", 
        des:
      `
      <:Picsart_241028_170653120:1303325780704759868> - **قائمة الاوامر**:

<:premuim:1341414399696703549>  يمكنك **الاختيار** من القائمه أدناه للحصول على **المطلوب**.

1 - ${emoji.esar_arrow} الالعاب الفرديه
2 - ${emoji.esar_arrow} الالعاب الثنائيه
3 - ${emoji.esar_arrow} الالعاب الجماعيه
4 - ${emoji.esar_arrow} اوامر السلاش
5 - ${emoji.all} الكل

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
    await interaction.editReply({
      embeds: [Embed],
      components: [actionrow],
    });
  }
}
}
