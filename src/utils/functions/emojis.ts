interface emoji extends Record<string, string | Record<string, string>> {
  true: string;
  trueURL: string;
  false: string;
  falseURL: string;
  BaseURL: string;
  esar_arrow: string;
  emen_arrow: string;
  all: string;
  open: string;
  close: string;
  roulette: Record<string, string>;
  outbotgames: string;
}

const emoji: emoji = {
  roulette: {
    join_game: "<:emoji_26:1327724484815228948>",
    leave_game: "<:emoji_24:1327724470797996133>",
    shop: "<:puzzle:1343029545544061042>",
    time: "<:waste:1343052121171562618>"
  },
  true: "<:highquality:1343673377621278760>",
  trueURL: "https://cdn.discordapp.com/emojis/1343673377621278760.png?quality=lossless",
  false: "<:IMG_27191:1343973356474601472>",
  falseURL: "https://cdn.discordapp.com/emojis/1343973356474601472.png?quality=lossless",
  BaseURL: "https://cdn.discordapp.com/emojis/1343675920837513276.png?quality=lossless", //Logo
  esar_arrow: "<:1323739617790263326:1341704260483551323>",
  emen_arrow: "<:file:1341703206127931498>",
  all: "<:all_2:1341693257062813746>",
  open: "<:openbracket:1343040121376739389>",
  close: "<:brackets:1343040104511569920>",
  outbotgames: "<:IMG_1454__1_removebgpreview:1343675920837513276>"
};

export default emoji;
