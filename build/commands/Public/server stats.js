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
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const SchemaChannel_1 = __importDefault(require("../../schema/SchemaChannel"));
const SchemaPrefix_1 = __importDefault(require("../../schema/SchemaPrefix"));
const SchemaServerUsedStats_1 = __importDefault(require("../../schema/SchemaServerUsedStats"));
class stats extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("server")
                .setDescription("معرفه معلومات السيرفر بشكل أدق.")
                .addSubcommand(sub => sub
                .setName('stats')
                .setDescription("معرفه معلومات السيرفر بشكل أدق.")),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return interaction.editReply({
                        content: `${emojis_1.default.false} | ?`,
                    });
                }
                const data = (yield SchemaChannel_1.default.findOne({
                    guildId: interaction.guild.id,
                })) || null;
                const prefixFind = yield SchemaPrefix_1.default.findOne({
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                    channelId: (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.id,
                });
                const statsfind = yield SchemaServerUsedStats_1.default.findOne({
                    guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                });
                let statsMessage = "الاوامر المستخدمه:\n";
                if (statsfind && statsfind.commands) {
                    let commandsData = statsfind.commands instanceof Map ? Object.fromEntries(statsfind.commands) : statsfind.commands;
                    for (const [command, count] of Object.entries(commandsData)) {
                        statsMessage += `🛠 **${command}**: ${count} مرة\n`;
                    }
                }
                const Embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "معلومات السيرفر",
                    des: `رومات الألعاب: ${emojis_1.default.close} **${((_e = data === null || data === void 0 ? void 0 : data.channelId) === null || _e === void 0 ? void 0 : _e.length) ? data.channelId.map(id => `<#${id}>`).join(' ') : "لا يوجد"}** ${emojis_1.default.open} \n
                  اول روم تم تعيينه في تاريخ: ${(data === null || data === void 0 ? void 0 : data.date) ? `<t:${Math.floor(data.date.getTime() / 1000)}:R>` : "غير متوفر"}\n
                  ${(prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix.length) === 1 ? "بادئة" : "بادئات"} **البوت**: ${emojis_1.default.close} **${((_f = prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix) === null || _f === void 0 ? void 0 : _f.join(", ")) || "+"}** ${emojis_1.default.open}\n
                  آخر روم تم تعيينه في تاريخ: ${(data === null || data === void 0 ? void 0 : data.dateend) ? `<t:${Math.floor(data.dateend.getTime() / 1000)}:R>` : "غير متوفر"}\n
                  تم لعب بمجموع: ${(statsfind === null || statsfind === void 0 ? void 0 : statsfind.statsall) || "0"} مرّه\n\n${statsMessage}`,
                    line: false,
                    footer: "Server Info.",
                    fields: "Server Info."
                }, "Base");
                if (Embed) {
                    yield interaction.editReply({
                        embeds: [Embed]
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = stats;
