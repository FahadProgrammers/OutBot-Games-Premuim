import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import channel from "../../schema/SchemaChannel";
import mainembed from "../../utils/embeds/mainEmbed";
import ms from "ms";
import moment from "moment";
import emoji from "../../utils/functions/emojis";
import schema from "../../schema/SchemaPushStatus";

export default class push extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("pushh")
        .setDescription("push updates.")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommand((sub) =>
          sub
            .setName("updates")
            .setDescription("push updates.")
            .addStringOption((string) =>
              string
                .setName("version")
                .setRequired(true)
                .setDescription("verision update.")
            )
            .addStringOption((string) =>
              string
                .setName("message")
                .setRequired(true)
                .setDescription("messageId to get message update.")
            )
        ),

      category: Category.Dev,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      const version = interaction.options.getString("version");
      const message = interaction.options.getString("message");

      const UsersAllow = ["709981152093667359"];

      if (!UsersAllow.includes(interaction.user.id)) {
        return interaction.editReply({
          content: "!",
        });
      }

      if (!interaction.guild?.id) {
        return interaction.editReply({
          content: `${emoji.false} | ?`,
        });
      }
      const schemaFindDatas = await channel.find();
      if (typeof message === "string") {
        const messageFetched = await interaction.channel?.messages.fetch(
          message
        );
        let messageContentOrEmbedContent;
        if (messageFetched?.embeds.length === 0) {
          messageContentOrEmbedContent = messageFetched.content;
        } else {
          messageContentOrEmbedContent =
            messageFetched?.embeds[0]?.description || null;
        }

        for (let data of schemaFindDatas) {
          if (Array.isArray(data.channelId)) {
            for (let channelId of data.channelId) {
              const query = await schema
                .findOne({ guildId: data.guildId })
                .catch(console.error);

              if (query) {
                continue;
              }

              const channelCache = this.client.channels.cache.get(channelId);
              if (!channelCache || !(channelCache instanceof TextChannel)) {
                continue;
              }
              if (messageContentOrEmbedContent)
                try {
                  const embUpdate = await mainembed(
                    messageContentOrEmbedContent,
                    "New Update!",
                    "New Update!"
                  );
                  const btnUpdateRow =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                      new ButtonBuilder()
                        .setLabel(`${version}V`)
                        .setEmoji("🎉")
                        .setDisabled(true)
                        .setCustomId("version_disabled")
                        .setStyle(ButtonStyle.Danger)
                    );

                  const sentMessage = await channelCache.send({
                    embeds: [embUpdate],
                    components: [btnUpdateRow],
                  });

                  if (
                    channelCache.guild.members.me?.permissions.has(
                      "ManageMessages"
                    )
                  ) {
                    await sentMessage.pin();
                  }
                } catch (err) {
                  console.error(
                    "خطأ أثناء إرسال التحديث:",
                    channelCache.id,
                    err
                  );
                }
            }
          }
        }
        await interaction.editReply({
          content: "Done ✅...",
        });
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred : of command /push alert",
        error
      );
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Error. Please try again later.");
      interaction.editReply({ embeds: [embed] });
    }
  }
}
