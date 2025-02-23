import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  parseEmoji,
} from "discord.js";
import schema from "../../schema/SchemaUsers";
import { profileImage } from "discord-arts";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import mainembed from "../../utils/embeds/mainEmbed";
import emoji from "../../utils/functions/emojis";
import rank from "../../utils/functions/rank";
import axios from "axios";

export default class profile extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("الملف الشخصي لك/لغيرك.")
        .addUserOption((command) => command
      .setName('member')
      .setDescription('معرفة بروفايل شخص>')
      .setRequired(false)
    )
        ,
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

    const user = interaction.options.getUser('member') || interaction.user;
    const schema_2 = await schema.findOne({
      guildId: interaction.guild?.id,
      userId: user?.id,
    });

    const schema_3 = (await schema.findOne({
      guildId: interaction.guild?.id,
      userId: user?.id,
    })) || { p: 1 };

    let rank_2;
    if (schema_2 && schema_2.p !== undefined) {
      rank_2 = rank(schema_2.p);
    } else {
      rank_2 = rank(0);
    }

    let emojiURL = [];
    let id2;
    let type;

    if (rank_2.badges) {
      for (let rank of rank_2.badges) {
        let emojiParseName = parseEmoji(rank)?.name;
        let id1 = rank.match(/\d{15,}/g);
        if (id1) {
          id2 = id1[0];
          type = await axios
            .get(`https://cdn.discordapp.com/emojis/${id2}.gif`)
            .then((image) => {
              if (image) return "gif";
              else return "png";
            })
            .catch((error) => {
              return "png";
            });
        }
        emojiURL.push(
          `https://cdn.discordapp.com/emojis/${id2}.${type}?quality=lossless`
        );
      }
    }

    const schemaFindAll = await schema.find({
      guildId: interaction?.guild.id,
    });
    let indexRank;
    if (schemaFindAll) {
      const top10PointsAll = schemaFindAll
        .sort((a, b) => b.p - a.p)
        .map((entry, index) => {
          if (entry.userId === user.id) {
            indexRank = index;
            return;
          }
        });

      const buffer = await profileImage(user.id, {
        customBadges: emojiURL,
        presenceStatus: await interaction?.guild.members.cache.get(user?.id)
          ?.presence?.status,
        badgesFrame: true,
        customDate: "OutBot Games",
        moreBackgroundBlur: true,
        backgroundBrightness: 100,
        borderColor: "#d71d00",
        rankData: {
          currentXp: schema_3?.p ?? 0,
          requiredXp: rank_2?.nextptrial ?? 0,
          rank: indexRank,
          level: rank_2?.rank ?? 0,
          barColor: "#d71d00",
          levelColor: "#d71d00",
          autoColorRank: true,
        },
      });

      interaction.followUp({ files: [buffer] });
    }
  }
}
