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
const fast_levenshtein_1 = __importDefault(require("fast-levenshtein"));
const SchemaEvent_1 = __importDefault(require("../../../schema/SchemaEvent"));
const SchemaPrefix_1 = __importDefault(require("../../../schema/SchemaPrefix"));
const Category_1 = __importDefault(require("../../../base/enums/Category"));
const utils_1 = __importDefault(require("../../../utils/utils"));
const SchemaChannel_1 = __importDefault(require("../../../schema/SchemaChannel"));
const BaseEmbed_1 = __importDefault(require("../../../utils/embeds/BaseEmbed"));
class MessageCommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.MessageCreate,
            description: "Command Handler MessageCreate",
            once: false,
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!message.content || typeof message.content !== "string") {
                return;
            }
            try {
                const DataPrefix = yield SchemaPrefix_1.default.findOne({
                    guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                    channelId: message.channel.id,
                });
                const Channels = yield SchemaChannel_1.default.findOne({
                    guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
                });
                let prefix = utils_1.default.defaultPrefix;
                if (typeof prefix === "string" || Array.isArray(DataPrefix === null || DataPrefix === void 0 ? void 0 : DataPrefix.prefix)) {
                    let usedPrefix = "";
                    if (Array.isArray(DataPrefix === null || DataPrefix === void 0 ? void 0 : DataPrefix.prefix)) {
                        usedPrefix = (DataPrefix === null || DataPrefix === void 0 ? void 0 : DataPrefix.prefix.find(p => message.content.startsWith(p))) || "";
                        if (!usedPrefix)
                            return;
                    }
                    else {
                        usedPrefix = prefix;
                        if (!message.content.startsWith(usedPrefix))
                            return;
                    }
                    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
                    const cmd = (_c = args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                    if (!cmd)
                        return;
                    if (Channels) {
                        if (Channels === null || Channels === void 0 ? void 0 : Channels.channelId.includes(message.channel.id)) {
                            let command = this.client.messagecommands.get(cmd) ||
                                this.client.messagecommandshorts.get(cmd);
                            if (!command) {
                                const commands = yield this.client.messagecommands;
                                let bestMatch = { word: "", distance: Infinity };
                                for (const commandd of commands) {
                                    const distance = fast_levenshtein_1.default.get(cmd, commandd[0]);
                                    if (distance < bestMatch.distance) {
                                        bestMatch = { word: commandd[0], distance };
                                    }
                                }
                                if (bestMatch.distance <= 2) {
                                    if (message.guild) {
                                        const Embed = (0, BaseEmbed_1.default)(message.guild, {
                                            title: "الأمر غير صحيح!",
                                            des: `هل الامر الذي **تقصده** هو: \`${bestMatch.word} \` `,
                                            line: true,
                                            footer: "Error.",
                                            fields: "Error."
                                        }, "Error");
                                        const Button = new discord_js_1.ActionRowBuilder()
                                            .addComponents(new discord_js_1.ButtonBuilder()
                                            .setLabel("نعم")
                                            .setStyle(discord_js_1.ButtonStyle.Success)
                                            .setCustomId(`runcommand_${bestMatch.word}_${message.id}`));
                                        if (Embed) {
                                            const msg = yield message.reply({
                                                embeds: [Embed],
                                                components: [Button]
                                            });
                                            setTimeout(function () {
                                                return __awaiter(this, void 0, void 0, function* () {
                                                    yield msg.delete().catch(e => { });
                                                });
                                            }, 5000);
                                        }
                                    }
                                }
                            }
                            else {
                                const { colldowns } = this.client;
                                if (!colldowns.has(command.name)) {
                                    colldowns.set(command.name, new discord_js_1.Collection());
                                }
                                const now = Date.now();
                                const timestamps = colldowns.get(command.name);
                                const cooldownAmount = (command.cooldown || 3) * 1000;
                                if (timestamps.has(message.author.id) &&
                                    now < timestamps.get(message.author.id) + cooldownAmount) {
                                    return message.reply({
                                        embeds: [
                                            new discord_js_1.EmbedBuilder()
                                                .setColor("Red")
                                                .setDescription(`❌ يرجى الصبر لمدة \`${((timestamps.get(message.author.id) +
                                                cooldownAmount -
                                                now) /
                                                1000).toFixed(1)}\` ثانيه لتشغيل الأمر`),
                                        ],
                                    });
                                }
                                timestamps.set(message.author.id, now);
                                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                                try {
                                    const findRoleEvent = yield SchemaEvent_1.default.findOne({
                                        guildId: (_d = message.guild) === null || _d === void 0 ? void 0 : _d.id,
                                        channelId: message.channel.id,
                                    });
                                    if (findRoleEvent) {
                                        const findRole = (_e = message.member) === null || _e === void 0 ? void 0 : _e.roles.cache.some((role) => findRoleEvent === null || findRoleEvent === void 0 ? void 0 : findRoleEvent.roleId.includes(role.id));
                                        if (!findRole) {
                                            if (findRoleEvent.command === "all") {
                                                return;
                                            }
                                            else if (findRoleEvent.command === 'one') {
                                                if (command.category === Category_1.default.فرديه) {
                                                    return;
                                                }
                                                else {
                                                    yield command.execute(message);
                                                }
                                            }
                                            else if (findRoleEvent.command === 'two') {
                                                if (command.category === Category_1.default.ثنائيه) {
                                                    return;
                                                }
                                                else {
                                                    yield command.execute(message);
                                                }
                                            }
                                        }
                                        else {
                                            yield command.execute(message);
                                        }
                                    }
                                    else {
                                        yield command.execute(message);
                                    }
                                }
                                catch (err) {
                                    console.log("err help sos", err);
                                    message.reply({
                                        embeds: [
                                            new discord_js_1.EmbedBuilder()
                                                .setColor("Red")
                                                .setDescription("❌ حدث خطأ ."),
                                        ],
                                    });
                                }
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.error("An error occurred in the message event:", err);
            }
        });
    }
}
exports.default = MessageCommandHandler;
