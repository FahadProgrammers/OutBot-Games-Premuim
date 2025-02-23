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
const discord_js_1 = require("discord.js");
const SchemaUsers_1 = __importDefault(require("../../schema/SchemaUsers"));
const discord_arts_1 = require("discord-arts");
const rank_1 = __importDefault(require("./rank"));
const axios_1 = __importDefault(require("axios"));
function profile(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!message.guild) {
            return yield message.reply({
                content: "?",
            });
        }
        const user = message.author;
        const schema_2 = yield SchemaUsers_1.default.findOne({
            guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
            userId: user === null || user === void 0 ? void 0 : user.id,
        });
        const schema_3 = (yield SchemaUsers_1.default.findOne({
            guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
            userId: user === null || user === void 0 ? void 0 : user.id,
        })) || { p: 1 };
        let rank_2;
        if (schema_2 && schema_2.p !== undefined) {
            rank_2 = (0, rank_1.default)(schema_2.p);
        }
        else {
            rank_2 = (0, rank_1.default)(0);
        }
        let emojiURL = [];
        let id2;
        let type;
        if (rank_2.badges) {
            for (let rank of rank_2.badges) {
                let emojiParseName = (_c = (0, discord_js_1.parseEmoji)(rank)) === null || _c === void 0 ? void 0 : _c.name;
                let id1 = rank.match(/\d{15,}/g);
                if (id1) {
                    id2 = id1[0];
                    type = yield axios_1.default
                        .get(`https://cdn.discordapp.com/emojis/${id2}.gif`)
                        .then((image) => {
                        if (image)
                            return "gif";
                        else
                            return "png";
                    })
                        .catch((error) => {
                        return "png";
                    });
                }
                emojiURL.push(`https://cdn.discordapp.com/emojis/${id2}.${type}?quality=lossless`);
            }
        }
        const schemaFindAll = yield SchemaUsers_1.default.find({
            guildId: message === null || message === void 0 ? void 0 : message.guild.id,
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
            const buffer = yield (0, discord_arts_1.profileImage)(user.id, {
                customBadges: emojiURL,
                presenceStatus: (_e = (_d = message === null || message === void 0 ? void 0 : message.guild.members.cache.get(user === null || user === void 0 ? void 0 : user.id)) === null || _d === void 0 ? void 0 : _d.presence) === null || _e === void 0 ? void 0 : _e.status,
                badgesFrame: true,
                customDate: "OutBot Games",
                moreBackgroundBlur: true,
                backgroundBrightness: 100,
                borderColor: "#d71d00",
                rankData: {
                    currentXp: (_f = schema_3 === null || schema_3 === void 0 ? void 0 : schema_3.p) !== null && _f !== void 0 ? _f : 0,
                    requiredXp: (_g = rank_2 === null || rank_2 === void 0 ? void 0 : rank_2.nextptrial) !== null && _g !== void 0 ? _g : 0,
                    rank: indexRank,
                    level: (_h = rank_2 === null || rank_2 === void 0 ? void 0 : rank_2.rank) !== null && _h !== void 0 ? _h : 0,
                    barColor: "#d71d00",
                    levelColor: "#d71d00",
                    autoColorRank: true,
                },
            });
            return buffer;
        }
    });
}
exports.default = profile;
