import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import BaseEmbed from "../../utils/embeds/BaseEmbed";

export default class top extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "لوحة النقاط",
      description: "ترتيب لوحة النقاط.",
      category: Category.ادمن,
      cooldown: 3,
      aliases: ["النقاط", "توب", "top"],
    });
  }
  async execute(message: Message) {
    try {
      if(!message.guild) {
        return;
      }

      const embed = BaseEmbed(
        message.guild,
        {
          title: "لوحة التوب",
          des: `<:number1:1343223920790212638> - **إضهار التوب **الخاص بلسيرفر
<:number2:1343223935415746621> - **إضهار اعلى اشخاص **يملكون نقاطا 
<:number3:1343223947705192468> - **إضهار التوب الخاص ب أكثر **سيرفر اُستخدم فيه البوت`,
line: false,
footer: "التوب",
fields: "التوب"
        },
      "Base"
    );
    if(embed) {

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("<:number1:1343223920790212638>")
        .setCustomId(`topserver_${message.guild?.id}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setEmoji("<:number2:1343223935415746621>")
        .setCustomId(`pall_${message.guild?.id}`)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setEmoji("<:number3:1343223947705192468>")
        .setCustomId(`serverused_${message.guild?.id}`)
        .setStyle(ButtonStyle.Secondary)
    );
    message.reply({ embeds: [embed], components: [row] });
  } 
} catch(err) {
    console.log(err);
  }
}
}
