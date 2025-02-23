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
const emojis_1 = __importDefault(require("./emojis"));
const SchemaUsers_1 = __importDefault(require("../../schema/SchemaUsers"));
const rank_1 = __importDefault(require("../../utils/functions/rank"));
const warnembed_1 = __importDefault(require("../../utils/embeds/warnembed"));
const BaseEmbed_1 = __importDefault(require("../embeds/BaseEmbed"));
const SchemaPrefix_1 = __importDefault(require("../../schema/SchemaPrefix"));
function Collecter(message, randomKey, randomValue, time_1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (message.channel instanceof discord_js_1.TextChannel) {
                const collector = yield message.channel
                    .awaitMessages({
                    filter: (m) => m.content.toLowerCase() === randomKey.toLowerCase(),
                    time: 5000,
                    errors: ["time"],
                    max: 1,
                })
                    .then((collected) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f;
                    const m = collected.first();
                    const time_2 = new Date().getTime();
                    const schema_2 = yield SchemaUsers_1.default.findOne({
                        guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                        userId: m === null || m === void 0 ? void 0 : m.author.id,
                    });
                    if (!schema_2) {
                        new SchemaUsers_1.default({
                            guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
                            userId: m === null || m === void 0 ? void 0 : m.author.id,
                            p: 0,
                        }).save();
                    }
                    else {
                        schema_2.p += 1;
                        yield schema_2.save();
                    }
                    let rank_2;
                    if (schema_2 && schema_2.p !== undefined) {
                        rank_2 = (0, rank_1.default)(schema_2.p);
                    }
                    else {
                        rank_2 = (0, rank_1.default)(0);
                    }
                    const elapsed_time = (time_2 - time_1) / 1000;
                    const minutes = Math.floor(elapsed_time / 60);
                    const remainingSeconds = (elapsed_time % 60).toFixed(1);
                    const content = minutes > 0
                        ? `${minutes} دقيقة و ${remainingSeconds} تقريبا`
                        : `${remainingSeconds} تقريبا`;
                    const schema_3 = yield SchemaUsers_1.default.findOne({
                        guildId: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.id,
                        userId: m === null || m === void 0 ? void 0 : m.author.id,
                    });
                    if (schema_3) {
                        const btns = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                            .setEmoji(rank_2.emoji)
                            .setCustomId("rank_info")
                            .setStyle(discord_js_1.ButtonStyle.Secondary)
                            .setLabel(`${rank_2.name} (${(_d = schema_3.p) !== null && _d !== void 0 ? _d : 1})`), new discord_js_1.ButtonBuilder()
                            .setEmoji("<:emoji_12:1300923537518887033>")
                            .setLabel(content)
                            .setCustomId("dis")
                            .setDisabled(true)
                            .setStyle(discord_js_1.ButtonStyle.Secondary));
                        const prefixx = (yield SchemaPrefix_1.default.findOne({
                            guildId: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id,
                            channelId: message.channel.id,
                        })) || { prefix: "+" };
                        if (message.guild) {
                            const greensuccess = (0, BaseEmbed_1.default)(message.guild, {
                                title: "إجابه صحيحه",
                                des: `
            > ${emojis_1.default.true} فنان، إجابه **صحيحه** ( \`**${randomKey}**\` )

-# ${emojis_1.default.emen_arrow} ل رؤية البروفايل الخاص بك بشكل أسرع استخدم
-# /profile | ${prefixx.prefix}بروفايل
            `,
                                line: true,
                                footer: "Success",
                                fields: "Success"
                            }, "Success");
                            if (greensuccess) {
                                yield message.reply({
                                    content: `<@${(_f = m === null || m === void 0 ? void 0 : m.author) === null || _f === void 0 ? void 0 : _f.id}>`,
                                    embeds: [greensuccess],
                                    components: [btns],
                                });
                            }
                        }
                    }
                }))
                    .catch((collected) => __awaiter(this, void 0, void 0, function* () {
                    const warningembed_2 = (0, warnembed_1.default)(`> ${emojis_1.default.false} للأسف، إجابه **خاطئه** او قد **انتهى الوقت**.`);
                    yield message.reply({
                        embeds: [warningembed_2],
                    });
                }));
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = Collecter;
