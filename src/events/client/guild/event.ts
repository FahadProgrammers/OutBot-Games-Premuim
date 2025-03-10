import {
  Events,
  Interaction,
  TextChannel,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import schema from "../../../schema/SchemaEventStarter";
import emoji from "../../../utils/functions/emojis";
import BaseEmbed from "../../../utils/embeds/BaseEmbed"; // تأكد من استيراد BaseEmbed

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith("buttonn_")) {
      const [, name, channelId] = interaction.customId.split("_");

      if(!interaction.guild) return;

      const embed = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          line: false,
          title: "يرجى الاختيار ماتريد من الالعاب أدناه",
          footer: "System",
          fields: "System",
        },
        "Base"
      );
if(embed) {
      let query = await schema.findOne({
        guildId: interaction.guild?.id,
        channel: channelId,
      });

      if (!query) {
        new schema({
          guildId: interaction.guild?.id,
          channel: channelId,
          commands: [name],
        }).save();
      } else {
        if (query.commands?.includes(name)) {
          query.commands = query.commands.filter((data) => data !== name);
          await query.save();
          query = await schema.findOne({
            guildId: interaction.guild?.id,
            channel: channelId,
          });
          if (query?.commands)
            embed.spliceFields(0, 0, {
              name: `تم إضافة:`,
              value:
                query?.commands?.length > 0
                  ? query.commands
                      .map(
                        (command, index) =>
                          `<:Arrow1:1299711671052402718> ${command}`
                      )
                      .join("\n")
                  : "لايوجد",
            });

          await interaction.update({
            content: "OutBot Games",
            embeds: [embed],
          });
          return;
        }
        query.commands?.push(name);
        await query.save();
      }

      query = await schema.findOne({
        guildId: interaction.guild?.id,
        channel: channelId,
      });

      if (query?.commands)
        embed.spliceFields(0, 0, {
          name: `تم إضافة:`,
          value:
            query?.commands?.length > 0
              ? query.commands
                  .map(
                    (command, index) =>
                      `<:Arrow1:1299711671052402718> ${command}`
                  )
                  .join("\n")
              : "لايوجد",
        });
      await interaction.update({
        content: "OutBot Games",
        embeds: [embed],
      });
    } 
  } else if (interaction.customId.startsWith("okay_")) {
      const [, channelId] = interaction.customId.split("_");
      let query = await schema.findOne({
        guildId: interaction.guild?.id,
        channel: channelId,
      });
      if (query) {
        if(!interaction.guild) return;
        const embed = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            line: false,
            title: `تاكد من اختيار لعبه واحده على الاقل! | ${emoji.false}`,
            footer: "System",
            fields: "System",
          },
          "Base"
        )

        if (embed && query.commands?.length === 0) {
          return await interaction.update({
            embeds: [
          embed
            ],
            components: [],
          });
        }
      }
      if(!interaction.guild) return;
      const embed = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          line: false,
          title: `سيتم تفعيل اللعبه بإذن الله بعد قليل, أستمتع, ${emoji.true}`,
          footer: "System",
          fields: "System",
        },
        "Base"
      )
      if(embed) {
      await interaction.update({
        embeds: [
  embed,
        ],
        components: [],
      });

      if (query?.commands) {
        const CacheChannel = await this.client.channels.cache.get(channelId);

        if (CacheChannel instanceof TextChannel) {
          const message = await CacheChannel?.send({
            content:
              "السلام عليكم, سيتم بأذن الله بدء الفعاليه بعد قليل أستمتعو.",
          });
          for (const event of query.commands) {
            await new Promise<void>(async (resolve) => {
              setTimeout(async () => {
                if (interaction.channel instanceof TextChannel) {
                  const find = this.client.messagecommands.find(
                    (d) => d.name === event
                  );

                  if (message) {
                    await find?.execute(message);
                    resolve();
                  }
                }
              }, 5000);
            });
          }
          if (interaction.channel instanceof TextChannel) {
            const mm = await interaction.channel?.send({
              content:
                "** إن شاء الله تكون قد نالت على إعجابكم جميعًا. لا تنسوا الصلاة على النبي ﷺ**.",
            });
            await query.deleteOne();
          }
        }
      }
    }
   } else if (interaction.customId.startsWith("cancel")) {
      const [, channelId] = interaction.customId.split("_");
      let query = await schema.findOne({
        guildId: interaction.guild?.id,
        channel: channelId,
      });

      await query?.deleteOne();
      if(!interaction.guild
      ) return;
      const emb = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          line: false,
          title: `تم بنجاح تنفيذ الأمر | ${emoji.true}`,
          footer: "System",
          fields: "System",
        },
        "Base"
      );
      if(emb) {
      await interaction.update({
        embeds: [emb],
        components: [],
      });
    }
  }
  }
}