"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseEmbed;
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
const emojis_1 = __importDefault(require("../functions/emojis"));
;
function BaseEmbed(GuildiObject, EmbedObject, embedType) {
    try {
        let Embed = new discord_js_1.EmbedBuilder();
        let des = EmbedObject.des;
        let fields = EmbedObject.fields;
        let footer = EmbedObject.footer;
        let title = EmbedObject.title;
        let line = EmbedObject.line;
        if (line === true) {
            Embed.setImage(utils_1.default.Line);
        }
        if (embedType === "Base") {
            if (EmbedObject.title) {
                Embed
                    .setTitle(`OutBot - Games ${title ? `| ${title}` : ""}`);
            }
            if (EmbedObject.des) {
                Embed
                    .setDescription(des ? des : "ERR");
            }
            Embed
                .setTimestamp()
                .setFooter({
                text: `OutBot Games - ${footer ? footer : "Bot"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            })
                .setColor('Red')
                .setAuthor({
                name: `OutBot Games - ${fields ? fields : "Bot"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            });
            const emojiURL = emojis_1.default.BaseURL;
            Embed.setThumbnail(emojiURL);
        }
        else if (embedType === "Success") {
            if (EmbedObject.des) {
                Embed
                    .setDescription(des ? des : "ERR");
            }
            Embed
                .setTimestamp()
                .setFooter({
                text: `OutBot Games - ${footer ? footer : "Game"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            })
                .setColor('Green')
                .setAuthor({
                name: `OutBot Games - ${fields ? fields : "Game"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            });
            const emojiURL = emojis_1.default.trueURL;
            Embed.setThumbnail(emojiURL);
        }
        else if (embedType === "Error") {
            if (EmbedObject.des) {
                Embed
                    .setDescription(des ? des : "ERR");
            }
            Embed
                .setTimestamp()
                .setFooter({
                text: `OutBot Games - ${footer ? footer : "Game"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            })
                .setColor('Red')
                .setAuthor({
                name: `OutBot Games - ${fields ? fields : "Game"}`,
                iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
            });
            const emojiURL = emojis_1.default.falseURL;
            Embed.setThumbnail(emojiURL);
        }
        return Embed;
    }
    catch (err) {
        console.log('Error of BaseEmbed', err);
    }
}
;
