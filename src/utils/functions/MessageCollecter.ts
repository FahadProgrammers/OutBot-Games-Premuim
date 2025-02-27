import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
  WorkerSendPayloadOp,
} from "discord.js";
import BaseEmbed from "../embeds/BaseEmbed";
import emoji from "./emojis";
import rank from "./rank";
import schema from "../../schema/SchemaUsers";
import pschema from "../../schema/SchemaPrefix";
import success from "../games/success";
import CustomClient from "../../base/classes/CustomClient";
import SchemaChannel from "../../schema/SchemaChannel";
import RamdanXP from "../../schema/RamdanXP";

async function Collecter(client: CustomClient, message: Message, randomKey: string, time_1: number) {
  try {
    if (message.channel instanceof TextChannel) {
      let filter;
      if(message.mentions.users.first()) {
       filter = (m: Message) => m.author.id === message.mentions.users.first()?.id || m.author.id === m.author.id;
      } else {
        filter = (m: Message) => m.author.id !== message.client.user?.id;
      }
      const find = await SchemaChannel.findOne({
        guildId: message.guild?.id,
        channelId: message.channel.id
      });

      const collector = message.channel.createMessageCollector({
        filter,
        time: find?.time ? find.time * 1000 : 5000,
      });

      collector.on("collect", async (m) => {
        if (m.content.toLowerCase() === randomKey.toLowerCase()) {
          // ✅ **إجابة صحيحة - يتم إيقاف الجامع فورًا**
          collector.stop();
          const time_2 = new Date().getTime();

          let schema_2 = await schema.findOne({
            guildId: message.guild?.id,
            userId: m?.author.id,
          });

          if (!schema_2) {
            schema_2 = new schema({
              guildId: message.guild?.id,
              userId: m?.author.id,
              p: 0,
            });
            await schema_2.save();
          } else {
            schema_2.p += 1;
            await schema_2.save();
          }

          const rank_2 = schema_2.p !== undefined ? rank(schema_2.p) : rank(0);

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

          if (schema_3) {
            const btns = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setEmoji(rank_2.emoji)
                .setCustomId("disabled_ranl")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`${rank_2.name} [ ${schema_3.p ?? 1} ]`),
              new ButtonBuilder()
                .setEmoji("<:time:1343029577701654568>")
                .setLabel(content)
                .setCustomId("dis")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setLabel("نظام النقاط")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("rank_info")
                .setEmoji("<:badge:1343344820395184251>"),
                new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("ramdan")
                .setEmoji("<:lamp:1344759310663811146>")
            );


            const prefixx = (await pschema.findOne({
              guildId: message.guild?.id,
              channelId: message.channel.id,
            })) || { prefix: "+" };

            if (message.guild) {
              const ran = success[Math.floor(Math.random() * success.length)];
              const greensuccess = await BaseEmbed(
                client,
                message.guild,
                {
                  title: "إجابه صحيحه",
                  des: `> ${emoji.true} ${ran}, إجابه **صحيحه** ( \`**${randomKey}**\` )

-# ${emoji.emen_arrow} ل رؤية البروفايل الخاص بك بشكل أسرع استخدم 
-# /profile | ${prefixx.prefix}بروفايل
                  `,
                  line: true,
                  footer: "Success",
                  fields: "Success",
                },
                "Success"
              );

              if (greensuccess) {
                await message.reply({
                  content: `<@${m?.author?.id}>`,
                  embeds: [greensuccess],
                  components: [btns],
                });
              }
            }
          }
        } else {
          // ❌ **إجابة خاطئة - يتم إيقاف الجامع فورًا وإرسال الرد**
          collector.stop();

          if (message.guild) {
            const wrongAnswerEmbed = await BaseEmbed(
              client,
              message.guild,
              {
                title: "إجابه خاطئه!",
                des: `> ${emoji.false} | للأسف، **إجابه خاطئه**.\n ( \`**${randomKey}** )\``,
                line: false,
                footer: "إجابه خاطئه!",
                fields: "إجابه خاطئه!",
              },
              "Error"
            );
            if (wrongAnswerEmbed) {
              wrongAnswerEmbed.setThumbnail(emoji.falseURL);

              await message.reply({
                embeds: [wrongAnswerEmbed],
              });
            }
          }
        }
      });

      collector.on("end", async (_, reason) => {
        if (reason === "time") {
          // ⏳ **انتهى الوقت ولم يجب أحد إجابة صحيحة**
          if (message.guild) {
            const timeUpEmbed = await BaseEmbed(
              client,
              message.guild,
              {
                title: "انتهى الوقت!",
                des: `> ⏳ | للأسف، لقد **انتهى الوقت**.\n ( \`**${randomKey}**\` ) `,
                line: false,
                footer: "انتهى الوقت!",
                fields: "انتهى الوقت!",
              },
              "Error"
            );
            if (timeUpEmbed) {
              timeUpEmbed.setThumbnail(
                "https://cdn.discordapp.com/emojis/1343029577701654568.png?quality=lossless"
              );

                await message.reply({
                  embeds: [timeUpEmbed],
                });
              
            }
          }
        }
      });
    
  }
  } catch (err) {
    console.log(err);
  }
}

export default Collecter;
