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
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class event extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("game")
                .setDescription(`بدء تشغيل الالعاب المتوصله/واحده مع اختيار الأوامر.`)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command
                .setName('start')
                .setDescription(`بدء تشغيل الالعاب المتوصله مع اختيار 
الأوامر.`)
                .addChannelOption((channel) => channel
                .setName("channel")
                .setDescription("قناة بدء اللعبه")
                .setRequired(false)
                .addChannelTypes(discord_js_1.ChannelType.GuildText))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const channelId = (yield ((_a = interaction.options.getChannel("channel")) === null || _a === void 0 ? void 0 : _a.id)) ||
                    ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id);
                yield interaction.deferReply({
                    ephemeral: true,
                });
                yield interaction.editReply({
                    content: "Waiting...",
                });
                const commands = yield this.client.messagecommands;
                const rows = [];
                let currentRow = new discord_js_1.ActionRowBuilder();
                const cancel = new discord_js_1.ButtonBuilder()
                    .setCustomId(`cancel_${channelId}`)
                    .setLabel("إلغاء")
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const okay = new discord_js_1.ButtonBuilder()
                    .setCustomId(`okay_${channelId}`)
                    .setLabel("تأكيد")
                    .setStyle(discord_js_1.ButtonStyle.Success);
                currentRow.addComponents(cancel, okay);
                commands.forEach((command, key) => {
                    if (command.category === Category_1.default.ادمن)
                        return;
                    const button = new discord_js_1.ButtonBuilder()
                        .setCustomId(`buttonn_${command.name}_${channelId}`)
                        .setLabel(command.name || key)
                        .setStyle(discord_js_1.ButtonStyle.Secondary);
                    currentRow.addComponents(button);
                    if (currentRow.components.length === 5) {
                        rows.push(currentRow);
                        currentRow = new discord_js_1.ActionRowBuilder();
                    }
                });
                if (currentRow.components.length > 0) {
                    rows.push(currentRow);
                }
                if (!((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id)) {
                    return interaction.editReply({
                        content: "❌ | حدث خطأ في تحديد الخادم.",
                    });
                }
                const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "يرجى الاختيار ماتريد من الالعاب أدناه",
                    footer: "اختر اللعبة التي ترغب بها",
                    fields: "اختر اللعبة التي ترغب بها",
                    line: true,
                }, "Base");
                if (embed) {
                    embed.addFields({
                        name: `تم إضافة:`,
                        value: `لايوجد`,
                    });
                    yield interaction.editReply({
                        content: "OutBot Games",
                        embeds: [embed],
                        components: rows,
                    });
                }
            }
            catch (error) {
                console.error("An unexpected error occurred : of command /push alert", error);
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Error")
                    .setDescription("Error. Please try again later.");
                interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
exports.default = event;
