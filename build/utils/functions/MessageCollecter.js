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
const BaseEmbed_1 = __importDefault(require("../embeds/BaseEmbed"));
const emojis_1 = __importDefault(require("./emojis"));
const rank_1 = __importDefault(require("./rank"));
const SchemaUsers_1 = __importDefault(require("../../schema/SchemaUsers"));
const SchemaPrefix_1 = __importDefault(require("../../schema/SchemaPrefix"));
function Collecter(message, randomKey, time_1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (message.channel instanceof discord_js_1.TextChannel) {
                const filter = (m) => { var _a; return m.author.id !== ((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.id); };
                const collector = message.channel.createMessageCollector({
                    filter,
                    time: 5000,
                });
                collector.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f;
                    if (m.content.toLowerCase() === randomKey.toLowerCase()) {
                        // ✅ **إجابة صحيحة - يتم إيقاف الجامع فورًا**
                        collector.stop();
                        const time_2 = new Date().getTime();
                        let schema_2 = yield SchemaUsers_1.default.findOne({
                            guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                            userId: m === null || m === void 0 ? void 0 : m.author.id,
                        });
                        if (!schema_2) {
                            schema_2 = new SchemaUsers_1.default({
                                guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
                                userId: m === null || m === void 0 ? void 0 : m.author.id,
                                p: 0,
                            });
                            yield schema_2.save();
                        }
                        else {
                            schema_2.p += 1;
                            yield schema_2.save();
                        }
                        const rank_2 = schema_2.p !== undefined ? (0, rank_1.default)(schema_2.p) : (0, rank_1.default)(0);
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
                                .setCustomId("disabled_ranl")
                                .setDisabled(true)
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setLabel(`${rank_2.name} - ${(_d = schema_3.p) !== null && _d !== void 0 ? _d : 1}`), new discord_js_1.ButtonBuilder()
                                .setEmoji("<:time:1343029577701654568>")
                                .setLabel(content)
                                .setCustomId("dis")
                                .setDisabled(true)
                                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                                .setLabel("نظام النقاط")
                                .setStyle(discord_js_1.ButtonStyle.Primary)
                                .setCustomId("rank_info")
                                .setEmoji("<:waste:1343052121171562618>"));
                            const prefixx = (yield SchemaPrefix_1.default.findOne({
                                guildId: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id,
                                channelId: message.channel.id,
                            })) || { prefix: "+" };
                            if (message.guild) {
                                const greensuccess = (0, BaseEmbed_1.default)(message.guild, {
                                    title: "إجابه صحيحه",
                                    des: `> ${emojis_1.default.true} فنان، إجابه **صحيحه** ( \`**${randomKey}**\` )

-# ${emojis_1.default.emen_arrow} ل رؤية البروفايل الخاص بك بشكل أسرع استخدم 
-# /profile | ${prefixx.prefix}بروفايل
                  `,
                                    line: true,
                                    footer: "Success",
                                    fields: "Success",
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
                    }
                    else {
                        // ❌ **إجابة خاطئة - يتم إيقاف الجامع فورًا وإرسال الرد**
                        collector.stop();
                        if (message.guild) {
                            const wrongAnswerEmbed = (0, BaseEmbed_1.default)(message.guild, {
                                title: "إجابه خاطئه!",
                                des: `> ${emojis_1.default.false} | للأسف، **إجابه خاطئه**.\n ( \`**${randomKey}**\``,
                                line: false,
                                footer: "إجابه خاطئه!",
                                fields: "إجابه خاطئه!",
                            }, "Error");
                            if (wrongAnswerEmbed) {
                                wrongAnswerEmbed.setThumbnail(emojis_1.default.falseURL);
                                yield message.reply({
                                    embeds: [wrongAnswerEmbed],
                                });
                            }
                        }
                    }
                }));
                collector.on("end", (_, reason) => __awaiter(this, void 0, void 0, function* () {
                    if (reason === "time") {
                        // ⏳ **انتهى الوقت ولم يجب أحد إجابة صحيحة**
                        if (message.guild) {
                            const timeUpEmbed = (0, BaseEmbed_1.default)(message.guild, {
                                title: "انتهى الوقت!",
                                des: `> ⏳ | للأسف، لقد **انتهى الوقت**.\n ( \`**${randomKey}**\` ) `,
                                line: false,
                                footer: "انتهى الوقت!",
                                fields: "انتهى الوقت!",
                            }, "Error");
                            if (timeUpEmbed) {
                                timeUpEmbed.setThumbnail("https://cdn.discordapp.com/emojis/1343029577701654568.png?quality=lossless");
                                yield message.reply({
                                    embeds: [timeUpEmbed],
                                });
                            }
                        }
                    }
                }));
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = Collecter;
