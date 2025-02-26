"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseEmbed;
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
const emojis_1 = __importDefault(require("../functions/emojis"));
const SchemaEmbedColor_1 = __importDefault(require("../../schema/SchemaEmbedColor"));
function BaseEmbed(client, GuildiObject, EmbedObject, embedType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let Embed = new discord_js_1.EmbedBuilder();
            let { title, des, line, footer, fields } = EmbedObject;
            let color = "Red";
            const find = yield SchemaEmbedColor_1.default.findOne({ guildId: GuildiObject.id });
            if (find) {
                color = find.embedcolor;
            }
            if (line) {
                Embed.setImage(utils_1.default.Line);
            }
            switch (embedType) {
                case "Base":
                    if (title) {
                        Embed.setTitle(`${GuildiObject.name} - ${title ? `${title}` : ""}`);
                    }
                    if (des) {
                        Embed.setDescription(des);
                    }
                    Embed.setAuthor({
                        name: `${GuildiObject.name} - ${fields || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setFooter({
                        text: `${GuildiObject.name} - ${footer || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setColor(color)
                        .setThumbnail(GuildiObject.iconURL() || emojis_1.default.BaseURL)
                        .setTimestamp();
                    break;
                case "Success":
                    Embed.setDescription(des || "ERR")
                        .setColor("Green")
                        .setAuthor({
                        name: `${GuildiObject.name} - ${fields || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setFooter({
                        text: `${GuildiObject.name} - ${fields || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setThumbnail(emojis_1.default.trueURL)
                        .setTimestamp();
                    break;
                case "Error":
                    Embed.setDescription(des || "ERR")
                        .setColor("Red")
                        .setAuthor({
                        name: `${GuildiObject.name} - ${fields || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setFooter({
                        text: `${GuildiObject.name} - ${fields || "Bot"}`,
                        iconURL: GuildiObject.iconURL() || emojis_1.default.BaseURL,
                    })
                        .setThumbnail(emojis_1.default.falseURL)
                        .setTimestamp();
                    break;
                default:
                    throw new Error("Invalid embedType provided.");
            }
            return Embed;
        }
        catch (err) {
            console.error("Error in BaseEmbed:", err);
            return null;
        }
    });
}
