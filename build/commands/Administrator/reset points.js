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
const SchemaUsers_1 = __importDefault(require("../../schema/SchemaUsers"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
class help extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("reset")
                .setDescription("إعادة تعيين نقاط الأعضاء.")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((sub) => sub
                .setName("points")
                .setDescription("إعادة تعيين نقاط الأعضاء.")
                .addUserOption((user) => user.setName("member").setDescription("العضو").setRequired(false))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield interaction.deferReply({
                ephemeral: true,
            });
            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                return interaction.editReply({
                    content: `${emojis_1.default.false} | ?`,
                });
            }
            const { options } = interaction;
            const member = options.getUser("member");
            if (member) {
                const membermention = `<@${member.id}>`;
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "هل انت متأكد من حذف بيانات المستخدم؟",
                    fields: membermention,
                    footer: "تأكيد الحذف",
                    line: true,
                }, "Base");
                const embErrorNoData = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "المستخدم لا يملك بيانات! :x:",
                    fields: membermention,
                    footer: "خطأ",
                    line: true,
                }, "Error");
                const find = yield SchemaUsers_1.default.findOne({
                    guildId: interaction.guild.id,
                    userId: member.id,
                });
                if (!find && embErrorNoData) {
                    yield interaction.editReply({
                        embeds: [embErrorNoData],
                    });
                    return;
                }
                const btn1 = new discord_js_1.ButtonBuilder()
                    .setLabel("نعم")
                    .setCustomId(`yes_${interaction.user.id}`)
                    .setStyle(discord_js_1.ButtonStyle.Success);
                const btn2 = new discord_js_1.ButtonBuilder()
                    .setLabel("إلغاء")
                    .setCustomId(`no_${interaction.user.id}`)
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const btnrow = new discord_js_1.ActionRowBuilder().addComponents(btn1, btn2);
                if (emb) {
                    const mm = yield interaction.editReply({
                        embeds: [emb],
                        components: [btnrow],
                    });
                    const coll = yield mm.createMessageComponentCollector({
                        time: 10000,
                        filter: (m) => !m.user.bot,
                        componentType: discord_js_1.ComponentType.Button,
                    });
                    coll.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        if (!interaction.guild)
                            return;
                        const embSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح تنفيذ الأمر",
                            fields: "تم حذف البيانات بنجاح.",
                            footer: "إعادة تعيين البيانات",
                            line: true,
                        }, "Success");
                        const embNo = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح إلغاء تنفيذ الأمر",
                            fields: "تم إلغاء الحذف.",
                            footer: "إلغاء الإجراء",
                            line: true,
                        }, "Cancel");
                        if (m.customId === `yes_${m.user.id}`) {
                            yield SchemaUsers_1.default.deleteOne({
                                guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
                                userId: member.id,
                            });
                            if (embSuccess)
                                yield m.update({
                                    embeds: [embSuccess],
                                    components: [],
                                });
                        }
                        else if (m.customId === `no_${m.user.id}`) {
                            if (embNo)
                                yield m.update({
                                    embeds: [embNo],
                                    components: [],
                                });
                        }
                    }));
                }
            }
            else {
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "هل انت متأكد من حذف بيانات المستخدمين؟",
                    footer: "تأكيد الحذف لجميع المستخدمين",
                    line: true,
                }, "Base");
                const embErrorNoData = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "السيرفر لا يملك بيانات! :x:",
                    footer: "خطأ",
                    line: true,
                }, "Error");
                const find = yield SchemaUsers_1.default.findOne({
                    guildId: interaction.guild.id,
                });
                if (!find && embErrorNoData) {
                    yield interaction.editReply({
                        embeds: [embErrorNoData],
                    });
                    return;
                }
                const btn1 = new discord_js_1.ButtonBuilder()
                    .setLabel("نعم")
                    .setCustomId(`yes_${interaction.guild.id}`)
                    .setStyle(discord_js_1.ButtonStyle.Success);
                const btn2 = new discord_js_1.ButtonBuilder()
                    .setLabel("إلغاء")
                    .setCustomId(`no_${interaction.guild.id}`)
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const btnrow = new discord_js_1.ActionRowBuilder().addComponents(btn1, btn2);
                if (emb) {
                    const mm = yield interaction.editReply({
                        embeds: [emb],
                        components: [btnrow],
                    });
                    const coll = yield mm.createMessageComponentCollector({
                        time: 10000,
                        filter: (m) => !m.user.bot,
                        componentType: discord_js_1.ComponentType.Button,
                    });
                    coll.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        if (!interaction.guild)
                            return;
                        const embSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح تنفيذ الأمر",
                            fields: "تم حذف بيانات جميع المستخدمين بنجاح.",
                            footer: "إعادة تعيين البيانات",
                            line: true,
                        }, "Success");
                        if (!interaction.guild)
                            return;
                        const embNo = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح إلغاء تنفيذ الأمر",
                            fields: "تم إلغاء الحذف لجميع المستخدمين.",
                            footer: "إلغاء الإجراء",
                            line: true,
                        }, "Cancel");
                        if (m.customId === `yes_${(_a = m.guild) === null || _a === void 0 ? void 0 : _a.id}`) {
                            yield SchemaUsers_1.default.deleteMany({
                                guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                            });
                            if (embSuccess)
                                yield m.update({
                                    embeds: [embSuccess],
                                    components: [],
                                });
                        }
                        else if (m.customId === `no_${(_c = m.guild) === null || _c === void 0 ? void 0 : _c.id}`) {
                            if (embNo)
                                yield m.update({
                                    embeds: [embNo],
                                    components: [],
                                });
                        }
                    }));
                }
            }
        });
    }
}
exports.default = help;
