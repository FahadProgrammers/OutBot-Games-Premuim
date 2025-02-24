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
const mainembedWithUser_1 = __importDefault(require("../../../utils/embeds/mainembedWithUser"));
const Category_1 = __importDefault(require("../../../base/enums/Category"));
const utils_1 = __importDefault(require("../../../utils/utils"));
const emojis_1 = __importDefault(require("../../../utils/functions/emojis"));
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
            if (!interaction.isChatInputCommand)
                return;
            if (!interaction.isStringSelectMenu())
                return;
            if (interaction.customId === "starter") {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const value = interaction.values[0];
                const member = interaction.member;
                const embed = (0, mainembedWithUser_1.default)(undefined, `help ( ${value} )`, `Game`, member);
                const commands = this.client.messagecommands;
                const commands2 = this.client.commands;
                let hasCommands = false;
                if (value !== "ادمن" && value !== "all") {
                    commands.forEach((command) => {
                        var _a;
                        if (((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) === "711370689126596618" && command.name === "خمن اليوتيوبر") {
                            return;
                        }
                        const isArabic = /[^\u0000-\u007F]/.test(command.name.charAt(0));
                        embed.addFields({
                            name: "<:1323739617790263326:1341704260483551323> " + command.name || "No Name",
                            value: "<:file1:1341704211972231249> " + `${command.description} \n اختصارات : ${isArabic ? emojis_1.default.close : emojis_1.default.open} **${command.aliases.join(",") || "لايوجد"}** ${isArabic ? emojis_1.default.open : emojis_1.default.close}`,
                        });
                        hasCommands = true;
                    });
                }
                else if (value !== "all") {
                    commands2.forEach((command) => {
                        if (command.category === value) {
                            embed.addFields({
                                name: "<:1323739617790263326:1341704260483551323> " + command.data.name || "No Name",
                                value: "<:file1:1341704211972231249> " + `${command.data.description}`,
                            });
                            hasCommands = true;
                        }
                    });
                }
                else if (value === "all") {
                    try {
                        const embeds = [];
                        let currentFields = [];
                        commands2.forEach((command) => {
                            if (command.category === Category_1.default.Dev)
                                return;
                            currentFields.push({
                                name: "<:1323739617790263326:1341704260483551323> " + "/" + (command.data.name || "No Name"),
                                value: "<:file1:1341704211972231249> " + `${command.data.description}`,
                            });
                            if (currentFields.length === 25) {
                                embeds.push({ fields: currentFields });
                                currentFields = [];
                            }
                        });
                        commands.forEach((command) => {
                            var _a;
                            if (((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) === "711370689126596618" && command.name === "خمن اليوتيوبر") {
                                return;
                            }
                            const isArabic = /[^\u0000-\u007F]/.test(command.name.charAt(0));
                            embed.addFields({
                                name: "<:1323739617790263326:1341704260483551323> " + command.name || "No Name",
                                value: "<:file1:1341704211972231249> " + `${command.description} \n اختصارات : ${isArabic ? emojis_1.default.open : emojis_1.default.close} **${command.aliases.join(",") || "لايوجد"}** ${isArabic ? emojis_1.default.close : emojis_1.default.open}`,
                            });
                            hasCommands = true;
                            if (currentFields.length === 25) {
                                embeds.push({ fields: currentFields });
                                currentFields = [];
                            }
                        });
                        if (currentFields.length > 0) {
                            embeds.push({ fields: currentFields });
                        }
                        if (embeds.length > 0) {
                            const embedBuilders = embeds.map(embedFields => new discord_js_1.EmbedBuilder().addFields(embedFields.fields).setColor('Red').setTitle("OutBot Games | All").setImage(utils_1.default.Line));
                            yield interaction.editReply({ embeds: embedBuilders });
                        }
                        hasCommands = true;
                        return;
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                if (!hasCommands) {
                    embed.setDescription("لايوجد اوامر");
                }
                yield interaction.editReply({
                    embeds: [embed],
                });
            }
        });
    }
}
exports.default = CommandHandler;
