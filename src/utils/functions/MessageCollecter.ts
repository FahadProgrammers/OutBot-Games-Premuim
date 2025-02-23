import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, TextChannel } from "discord.js";
import emoji from "./emojis";
import schema from "../../schema/SchemaUsers";
import rank from "../../utils/functions/rank";
import warningembed_1 from "../../utils/embeds/warnembed";
import BaseEmbed from "../embeds/BaseEmbed";
import pschema from "../../schema/SchemaPrefix";

async function Collecter(message: Message, randomKey: string, randomValue: string, time_1: number) {
  try {
if (message.channel instanceof TextChannel) {
    const collector = await message.channel
      .awaitMessages({
        filter: (m) => m.content.toLowerCase() === randomKey.toLowerCase(),
        time: 5000,
        errors: ["time"],
        max: 1,
      })
      .then(async (collected) => {
        const m = collected.first();
        const time_2 = new Date().getTime();
        const schema_2 = await schema.findOne({
          guildId: message.guild?.id,
          userId: m?.author.id,
        });
        if (!schema_2) {
          new schema({
            guildId: message.guild?.id,
            userId: m?.author.id,
            p: 0,
          }).save();
        } else {
          schema_2.p += 1;
          await schema_2.save();
        }
        let rank_2;
        if (schema_2 && schema_2.p !== undefined) {
          rank_2 = rank(schema_2.p);
        } else {
          rank_2 = rank(0);
        }
      

        const elapsed_time = (time_2 - time_1) / 1000;
        const minutes = Math.floor(elapsed_time / 60);
        const remainingSeconds = (elapsed_time % 60).toFixed(1);
        const content =
          minutes > 0
            ? `${minutes} دقيقة و ${remainingSeconds} تقريبا`
            : `${remainingSeconds} تقريبا`;
            const schema_3 = await schema.findOne({
              guildId: message.guild?.id,
              userId: m?.author.id,
            });
            if(schema_3) {
              const btns = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setEmoji(rank_2.emoji)
            .setCustomId("rank_info")
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`${rank_2.name} (${schema_3.p ?? 1})`),
          new ButtonBuilder()
            .setEmoji("<:emoji_12:1300923537518887033>")
            .setLabel(content)
            .setCustomId("dis")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)
        );

        const prefixx = (await pschema.findOne({
          guildId: message.guild?.id,
          channelId: message.channel.id,
        })) || { prefix: "+" };

        if(message.guild) {
        const greensuccess = BaseEmbed(
          message.guild,
          {
            title: "إجابه صحيحه",
            des: `
            > ${emoji.true} فنان، إجابه **صحيحه** ( \`**${randomKey}**\` )

-# ${emoji.emen_arrow} ل رؤية البروفايل الخاص بك بشكل أسرع استخدم
-# /profile | ${prefixx.prefix}بروفايل
            `,
            line: true,
            footer: "Success",
            fields: "Success"
          },
          "Success"
        );

        if(greensuccess) {
        await message.reply({
          content: `<@${m?.author?.id}>`,
          embeds: [greensuccess],
          components: [btns],
        });
      }
    }
      }
})
      .catch(async (collected) => {
        const warningembed_2 = warningembed_1(
          `> ${emoji.false} للأسف، إجابه **خاطئه** او قد **انتهى الوقت**.`
        );
        await message.reply({
          embeds: [warningembed_2],
        });
      });
    }
} catch(err) {
  console.log(err);
}
}

export default Collecter;