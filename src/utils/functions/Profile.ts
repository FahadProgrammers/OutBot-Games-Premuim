import { Message, MessageMentions, parseEmoji, User } from "discord.js";
import schema from "../../schema/SchemaUsers";
import { profileImage } from "discord-arts";
import rank from "./rank";
import axios from "axios";

async function profile(message: Message, mention: User) {
  if (!message.guild) {
    return await message.reply({
      content: "?",
    });
  }
  const user = mention || message.author;
  const schema_2 = await schema.findOne({
    guildId: message.guild?.id,
    userId: user?.id,
  });

  const schema_3 = (await schema.findOne({
    guildId: message.guild?.id,
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
    guildId: message?.guild.id,
  });
  let indexRank;
  if (schemaFindAll) {
    const top10PointsAll = schemaFindAll
      .sort((a, b) => b.p - a.p)
      .map((entry, index) => {
        if (entry.userId === user.id) {
          indexRank = index + 1;
          return;
        }
      });

    const buffer = await profileImage(user.id, {
      customBadges: emojiURL,
      presenceStatus: message?.guild.members.cache.get(user?.id)?.presence
        ?.status,
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
    return buffer;
  }
}

export default profile;
