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

export default class top extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "top",
      description: "ترتيب لوحة النقاط.",
      category: Category.ادمن,
      cooldown: 3,
      aliases: ["لوحة النقاط", "توب"],
    });
  }
  async execute(message: Message) {
    const embed = mainembed(
      `<:Arrow1:1299711671052402718> لوحة النقاط
        
اختر من الخيارات ادناه ماتريد
1. إضهار التوب الخاص بلسيرفر
2. إضهار اعلى اشخاص يملكون نقاطا `,
      "System",
      "System"
    );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("<:one:1309821400424644649>")
        .setCustomId(`topserver_${message.guild?.id}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setEmoji("<:two:1309821436503920691>")
        .setCustomId(`pall_${message.guild?.id}`)
        .setStyle(ButtonStyle.Secondary)
    );
    message.reply({ embeds: [embed], components: [row] });
  }
}
