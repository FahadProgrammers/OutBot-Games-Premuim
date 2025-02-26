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
const Events_1 = __importDefault(require("../../../base/classes/Events"));
const SchemaEventStarter_1 = __importDefault(require("../../../schema/SchemaEventStarter"));
const emojis_1 = __importDefault(require("../../../utils/functions/emojis"));
const BaseEmbed_1 = __importDefault(require("../../../utils/embeds/BaseEmbed")); // تأكد من استيراد BaseEmbed
class CommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Command Handler Event",
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (!interaction.isButton())
                return;
            if (interaction.customId.startsWith("buttonn_")) {
                const [, name, channelId] = interaction.customId.split("_");
                if (!interaction.guild)
                    return;
                const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    line: false,
                    title: "يرجى الاختيار ماتريد من الالعاب أدناه",
                    footer: "System",
                    fields: "System",
                }, "Base");
                if (embed) {
                    let query = yield SchemaEventStarter_1.default.findOne({
                        guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
                        channel: channelId,
                    });
                    if (!query) {
                        new SchemaEventStarter_1.default({
                            guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                            channel: channelId,
                            commands: [name],
                        }).save();
                    }
                    else {
                        if ((_c = query.commands) === null || _c === void 0 ? void 0 : _c.includes(name)) {
                            query.commands = query.commands.filter((data) => data !== name);
                            yield query.save();
                            query = yield SchemaEventStarter_1.default.findOne({
                                guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                                channel: channelId,
                            });
                            if (query === null || query === void 0 ? void 0 : query.commands)
                                embed.spliceFields(0, 0, {
                                    name: `تم إضافة:`,
                                    value: ((_e = query === null || query === void 0 ? void 0 : query.commands) === null || _e === void 0 ? void 0 : _e.length) > 0
                                        ? query.commands
                                            .map((command, index) => `<:Arrow1:1299711671052402718> ${command}`)
                                            .join("\n")
                                        : "لايوجد",
                                });
                            yield interaction.update({
                                content: "OutBot Games",
                                embeds: [embed],
                            });
                            return;
                        }
                        (_f = query.commands) === null || _f === void 0 ? void 0 : _f.push(name);
                        yield query.save();
                    }
                    query = yield SchemaEventStarter_1.default.findOne({
                        guildId: (_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.id,
                        channel: channelId,
                    });
                    if (query === null || query === void 0 ? void 0 : query.commands)
                        embed.spliceFields(0, 0, {
                            name: `تم إضافة:`,
                            value: ((_h = query === null || query === void 0 ? void 0 : query.commands) === null || _h === void 0 ? void 0 : _h.length) > 0
                                ? query.commands
                                    .map((command, index) => `<:Arrow1:1299711671052402718> ${command}`)
                                    .join("\n")
                                : "لايوجد",
                        });
                    yield interaction.update({
                        content: "OutBot Games",
                        embeds: [embed],
                    });
                }
            }
            else if (interaction.customId.startsWith("okay_")) {
                const [, channelId] = interaction.customId.split("_");
                let query = yield SchemaEventStarter_1.default.findOne({
                    guildId: (_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.id,
                    channel: channelId,
                });
                if (query) {
                    if (!interaction.guild)
                        return;
                    const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        line: false,
                        title: `تاكد من اختيار لعبه واحده على الاقل! | ${emojis_1.default.false}`,
                        footer: "System",
                        fields: "System",
                    }, "Base");
                    if (embed && ((_k = query.commands) === null || _k === void 0 ? void 0 : _k.length) === 0) {
                        return yield interaction.update({
                            embeds: [
                                embed
                            ],
                            components: [],
                        });
                    }
                }
                if (!interaction.guild)
                    return;
                const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    line: false,
                    title: `سيتم تفعيل اللعبه بإذن الله بعد قليل, أستمتع, ${emojis_1.default.true}`,
                    footer: "System",
                    fields: "System",
                }, "Base");
                if (embed) {
                    yield interaction.update({
                        embeds: [
                            embed,
                        ],
                        components: [],
                    });
                    if (query === null || query === void 0 ? void 0 : query.commands) {
                        const CacheChannel = yield this.client.channels.cache.get(channelId);
                        if (CacheChannel instanceof discord_js_1.TextChannel) {
                            const message = yield (CacheChannel === null || CacheChannel === void 0 ? void 0 : CacheChannel.send({
                                content: "السلام عليكم, سيتم بأذن الله بدء الفعاليه بعد قليل أستمتعو.",
                            }));
                            for (const event of query.commands) {
                                yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                        if (interaction.channel instanceof discord_js_1.TextChannel) {
                                            const find = this.client.messagecommands.find((d) => d.name === event);
                                            if (message) {
                                                yield (find === null || find === void 0 ? void 0 : find.execute(message));
                                                resolve();
                                            }
                                        }
                                    }), 5000);
                                }));
                            }
                            if (interaction.channel instanceof discord_js_1.TextChannel) {
                                const mm = yield ((_l = interaction.channel) === null || _l === void 0 ? void 0 : _l.send({
                                    content: "** إن شاء الله تكون قد نالت على إعجابكم جميعًا. لا تنسوا الصلاة على النبي ﷺ**.",
                                }));
                                yield query.deleteOne();
                            }
                        }
                    }
                }
            }
            else if (interaction.customId.startsWith("cancel")) {
                const [, channelId] = interaction.customId.split("_");
                let query = yield SchemaEventStarter_1.default.findOne({
                    guildId: (_m = interaction.guild) === null || _m === void 0 ? void 0 : _m.id,
                    channel: channelId,
                });
                yield (query === null || query === void 0 ? void 0 : query.deleteOne());
                if (!interaction.guild)
                    return;
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    line: false,
                    title: `تم بنجاح تنفيذ الأمر | ${emojis_1.default.true}`,
                    footer: "System",
                    fields: "System",
                }, "Base");
                if (emb) {
                    yield interaction.update({
                        embeds: [emb],
                        components: [],
                    });
                }
            }
        });
    }
}
exports.default = CommandHandler;
