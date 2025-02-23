import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import emoji from "../../utils/functions/emojis";
import schema from "../../schema/SchemaPushStatus";

export default class push extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("update")
        .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommandGroup((sub) =>
          sub
            .setName("message")
            .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)
            .addSubcommand((command) => command
            .setName('status')
            .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)

            .addStringOption((string) =>
              string
                .setName("status")
                .setRequired(true)
                .addChoices(
                  { name: "تفعيل", value: "on" },
                  { name: "إلغاء تفعيل", value: "off" }
                )
                .setDescription("تفعيل/اغلاق حالة رسائل التحديثات.")
            )
          )
        ),
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const status = interaction.options.getString("status");
      const guildId = interaction.guild?.id;

      if (!guildId) {
        return interaction.editReply({
          content: `${emoji.false} | حدث خطأ ما!`,
        });
      }

      const query = await schema.findOne({
        guildId,
      });

      if (status === "on") {
        if (query) {
          return interaction.editReply({
            content: `التحديثات مفعلة بالفعل لهذه القناة!`,
          });
        }

        await schema.create({
          guildId,
        });

        return interaction.editReply({
          content: `تم تفعيل التحديثات بنجاح! | ${emoji.true}`,
        });
      }

      if (status === "off") {
        if (!query) {
          return interaction.editReply({
            content: `التحديثات غير مفعلة لهذه القناة!`,
          });
        }

        await schema.deleteOne({
          guildId,
        });

        return interaction.editReply({
          content: `تم إلغاء تفعيل التحديثات بنجاح! | ${emoji.true}`,
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred : /push command", error);
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Error. Please try again later.");
      return interaction.editReply({ embeds: [embed] });
    }
  }
}
