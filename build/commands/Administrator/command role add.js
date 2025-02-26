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
const SchemaEvent_1 = __importDefault(require("../../schema/SchemaEvent"));
const SchemaChannel_1 = __importDefault(require("../../schema/SchemaChannel"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class Test extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("command")
                .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command
                .setName('control')
                .setDescription("تعطيل/تشغيل الأمر المخصص.")
                .addStringOption((command) => command
                .setName('command-select')
                .setDescription("اختر الامر")
                .setAutocomplete(true)
                .setRequired(true))
                .addBooleanOption((command) => command
                .setName('disabled')
                .setDescription('تشغيل/إطفاء')
                .setRequired(true)))
                .addSubcommandGroup((command) => command
                .setName('role')
                .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
                .addSubcommand((commandd) => commandd
                .setName('remove')
                .setDescription(`إزالة الرتبه الخاصه الى الأوامر.`)
                .addStringOption((option) => option
                .setName("select")
                .setDescription("عين الاختيارات المراد ازالتها")
                .setRequired(true)
                .setAutocomplete(true)))
                .addSubcommand((commanddd) => commanddd
                .setName('add')
                .setDescription(`إعداد رتبه خاصه الى الأوامر مع التخصيص.`)
                .addStringOption((option) => option
                .setName("channel")
                .setDescription("عين القناه المراد اختيارها")
                .setRequired(true)
                .setAutocomplete(true))
                .addRoleOption((option) => option
                .setName("role")
                .setDescription("عين الرتبه المراد اختيارها")
                .setRequired(true))
                .addStringOption((option) => option
                .setName("command")
                .setDescription("عين الامر المراد اختياره")
                .setRequired(true)
                .setAutocomplete(true)))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            yield interaction.deferReply({
                ephemeral: true,
            });
            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                return interaction.editReply({
                    content: `${emojis_1.default.false} | ?`,
                });
            }
            const subCommand = interaction.options.getSubcommand();
            if (subCommand === "add") {
                const channel = interaction.options.getString("channel");
                const role = interaction.options.getRole("role");
                const command = interaction.options.getString("command");
                const findChannel = yield SchemaChannel_1.default.findOne({
                    channelId: channel,
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                });
                if (!findChannel) {
                    const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "خطأ",
                        des: `${emojis_1.default.false} | تأكد من القناة!`,
                        line: true,
                        footer: "Error",
                        fields: "لا يوجد سجل لهذه القناة",
                    }, "Error");
                    if (emb) {
                        return interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
                const findCommand = this.client.messagecommands.some((command2) => command2.name === command);
                if (!findCommand &&
                    command !== "one" &&
                    command !== "two" &&
                    command !== "all") {
                    const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "خطأ",
                        des: `${emojis_1.default.false} | تأكد من الامر المختار!`,
                        line: true,
                        footer: "Error",
                        fields: "الأمر غير موجود أو غير صالح",
                    }, "Error");
                    if (emb) {
                        return interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
                const findData = yield SchemaEvent_1.default.findOne({
                    guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                    channelId: channel,
                    roleId: role === null || role === void 0 ? void 0 : role.id,
                    command: command,
                });
                if (findData) {
                    const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "خطأ",
                        des: `${emojis_1.default.false} | هذا السجل موجود بالفعل!`,
                        line: true,
                        footer: "Error",
                        fields: "السجل موجود في البيانات مسبقًا",
                    }, "Error");
                    if (emb) {
                        return interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
                new SchemaEvent_1.default({
                    guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                    channelId: channel,
                    roleId: role === null || role === void 0 ? void 0 : role.id,
                    command: command,
                }).save();
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "نجاح",
                    des: `${emojis_1.default.true} | تم بنجاح تنفيذ العملية`,
                    line: true,
                    footer: "Success",
                    fields: "تم إضافة السجل بنجاح",
                }, "Success");
                if (emb) {
                    yield interaction.editReply({
                        embeds: [emb],
                    });
                }
            }
            else if (subCommand === "remove") {
                const select_1 = interaction.options.getString("select");
                const split = select_1 === null || select_1 === void 0 ? void 0 : select_1.split("_");
                if (split) {
                    const findChannel = yield SchemaEvent_1.default.findOne({
                        channelId: split[0],
                        roleId: split[1],
                        command: split[2],
                        guildId: (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.id,
                    });
                    if (!findChannel) {
                        const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "خطأ",
                            des: `${emojis_1.default.false} | تأكد من القناة!`,
                            line: true,
                            footer: "Error",
                            fields: "القناة غير موجودة في البيانات",
                        }, "Error");
                        if (emb) {
                            return interaction.editReply({
                                embeds: [emb],
                            });
                        }
                    }
                    const findCommand = this.client.messagecommands.some((command2) => command2.name === (findChannel === null || findChannel === void 0 ? void 0 : findChannel.command));
                    if (!findCommand &&
                        (findChannel === null || findChannel === void 0 ? void 0 : findChannel.command) !== "one" &&
                        (findChannel === null || findChannel === void 0 ? void 0 : findChannel.command) !== "two" &&
                        (findChannel === null || findChannel === void 0 ? void 0 : findChannel.command) !== "all") {
                        const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "خطأ",
                            des: `${emojis_1.default.false} | تأكد من الأمر المختار!`,
                            line: true,
                            footer: "Error",
                            fields: "الأمر غير صالح",
                        }, "Error");
                        if (emb) {
                            return interaction.editReply({
                                embeds: [emb],
                            });
                        }
                    }
                    yield SchemaEvent_1.default.deleteOne({
                        guildId: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id,
                        channelId: split[0],
                        command: split[2],
                    });
                    const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "نجاح",
                        des: `${emojis_1.default.true} | تم بنجاح تنفيذ العملية`,
                        line: true,
                        footer: "Success",
                        fields: "تم إزالة السجل بنجاح",
                    }, "Success");
                    if (emb) {
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
            }
        });
    }
}
exports.default = Test;
