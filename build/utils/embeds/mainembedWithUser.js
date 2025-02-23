"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mainembed;
const discord_js_1 = require("discord.js");
function mainembed(des, footer, fields, member) {
    const embed = new discord_js_1.EmbedBuilder()
        // .setDescription(des ? des : "ㅤ")
        .setTimestamp()
        .setColor('Red');
    if (footer) {
        embed.setFooter({
            text: `OutBot Games - ${footer}`,
            iconURL: (member === null || member === void 0 ? void 0 : member.user) ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}` : undefined
        });
    }
    embed.setAuthor({
        name: `OutBot Games - ${fields ? fields : "Game"}`,
        iconURL: (member === null || member === void 0 ? void 0 : member.user) ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}` : undefined
    });
    return embed;
}
