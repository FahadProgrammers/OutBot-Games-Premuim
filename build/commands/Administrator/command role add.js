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
const SchemaCommandControl_1 = __importDefault(require("../../schema/SchemaCommandControl"));
const mainEmbed_1 = __importDefault(require("../../utils/embeds/mainEmbed"));
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
            var _a, _b, _c, _d, _e, _f, _g;
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
                    yield interaction.editReply({
                        embeds: [
                            (0, mainEmbed_1.default)(`${emojis_1.default.false} | تأكد من القناه!`, "System", "System"),
                        ],
                    });
                    return;
                }
                const findCommand = this.client.messagecommands.some((command2) => command2.name === command);
                if (!findCommand &&
                    command !== "one" &&
                    command !== "two" &&
                    command !== "all") {
                    yield interaction.editReply({
                        embeds: [
                            (0, mainEmbed_1.default)(`${emojis_1.default.false} | تأكد من الامر المختار!`, "System", "System"),
                        ],
                    });
                    return;
                }
                const findData = yield SchemaEvent_1.default.findOne({
                    guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                    channelId: channel,
                    roleId: role === null || role === void 0 ? void 0 : role.id,
                    command: command,
                });
                if (findData) {
                    yield interaction.editReply({
                        embeds: [
                            (0, mainEmbed_1.default)(`${emojis_1.default.false} | متوفر بالبيانات بلفعل!`, "System", "System"),
                        ],
                    });
                    return;
                }
                new SchemaEvent_1.default({
                    guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                    channelId: channel,
                    roleId: role === null || role === void 0 ? void 0 : role.id,
                    command: command,
                }).save();
                yield interaction.editReply({
                    embeds: [
                        (0, mainEmbed_1.default)(`${emojis_1.default.true} | تم بنجاح تنفيذ العمليه`, "System", "System"),
                    ],
                });
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
                        yield interaction.editReply({
                            embeds: [
                                (0, mainEmbed_1.default)(`${emojis_1.default.false} | تأكد من القناه!`, "System", "System"),
                            ],
                        });
                        return;
                    }
                    const findCommand = this.client.messagecommands.some((command2) => command2.name === findChannel.command);
                    if (!findCommand &&
                        findChannel.command !== "one" &&
                        findChannel.command !== "two" &&
                        findChannel.command !== "all") {
                        yield interaction.editReply({
                            embeds: [
                                (0, mainEmbed_1.default)(`${emojis_1.default.false} | تأكد من الامر المختار!`, "System", "System"),
                            ],
                        });
                        return;
                    }
                    const findData = yield SchemaEvent_1.default.findOne({
                        guildId: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id,
                        channelId: split[0],
                        command: split[2],
                    });
                    if (!findData) {
                        yield interaction.editReply({
                            embeds: [
                                (0, mainEmbed_1.default)(`${emojis_1.default.false} | غير متوفر بالبيانات بلفعل!`, "System", "System"),
                            ],
                        });
                        return;
                    }
                    yield SchemaEvent_1.default.deleteOne({
                        guildId: (_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.id,
                        channelId: split[0],
                        command: split[2],
                    });
                    yield interaction.editReply({
                        embeds: [
                            (0, mainEmbed_1.default)(`${emojis_1.default.true} | تم بنجاح تنفيذ العمليه`, "System", "System"),
                        ],
                    });
                }
            }
            else if (subCommand === "control") {
                const command = interaction.options.getString('command-select');
                if (command === "") {
                    const BaseEmbed1 = (0, BaseEmbed_1.default)(interaction.guild, {
                        title: "مهلا",
                        des: "هاذا الأمر غير مسموح لك بإستخدامه!",
                        line: true,
                        footer: "Error.",
                        fields: "Error."
                    }, "Error");
                    if (BaseEmbed1) {
                        return interaction.editReply({
                            embeds: [BaseEmbed1]
                        });
                    }
                }
                const disabled = interaction.options.getBoolean('disabled');
                let find = yield SchemaCommandControl_1.default.findOne({
                    guildId: interaction.guildId,
                });
                if (disabled && command) {
                    find = yield SchemaCommandControl_1.default.findOne({
                        guildId: interaction.guildId,
                    });
                    if (find === null || find === void 0 ? void 0 : find.command.includes(command)) {
                        const BaseEmbed1 = (0, BaseEmbed_1.default)(interaction.guild, {
                            title: "مهلا",
                            des: "الأمر بلفعل مغلق",
                            line: true,
                            footer: "Error.",
                            fields: "Error."
                        }, "Error");
                        if (BaseEmbed1) {
                            return interaction.editReply({
                                embeds: [BaseEmbed1]
                            });
                        }
                    }
                    else {
                        if (find) {
                            find.command.push(command);
                            yield find.save();
                        }
                        else {
                            new SchemaCommandControl_1.default({
                                guildId: interaction.guildId,
                                command: [command]
                            }).save();
                        }
                    }
                    const ddfind = yield SchemaCommandControl_1.default.findOne({
                        guildId: interaction.guildId,
                    });
                    let content = yield (ddfind === null || ddfind === void 0 ? void 0 : ddfind.command.map((data) => {
                        if (data === "all") {
                            return "جميع الاوامر";
                        }
                        else if (data === "one") {
                            return "الاوامر الفرديه";
                        }
                        else if (data === 'two') {
                            return "الاوامر الثنائيه";
                        }
                        else if (data === "three") {
                            return "اوامر المجموعه";
                        }
                        else {
                            return data;
                        }
                    }));
                    const BaseEmbed11 = yield (0, BaseEmbed_1.default)(interaction.guild, {
                        title: "تم بنجاح!",
                        des: `${emojis_1.default.true} | **تم بنجاح **تعطيل الأمر\n\nالأوامر المُعطله: ${emojis_1.default.close} **${content === null || content === void 0 ? void 0 : content.join(",")}** ${emojis_1.default.open}`,
                        line: true,
                        footer: "Success.",
                        fields: "Success."
                    }, "Success");
                    if (BaseEmbed11) {
                        return yield interaction.editReply({
                            embeds: [BaseEmbed11]
                        });
                    }
                }
                else {
                    if (!find) {
                        const BaseEmbed1 = (0, BaseEmbed_1.default)(interaction.guild, {
                            title: "مهلا",
                            des: "الأمر** غير **مفعل** ل إغلاقه**",
                            line: true,
                            footer: "Error.",
                            fields: "Error."
                        }, "Error");
                        if (BaseEmbed1) {
                            return interaction.editReply({
                                embeds: [BaseEmbed1]
                            });
                        }
                    }
                    else {
                        find.command = find.command.filter((c) => c !== command);
                        yield find.save();
                        const BaseEmbed11 = (0, BaseEmbed_1.default)(interaction.guild, {
                            title: "تم بنجاح!",
                            des: `${emojis_1.default.true} | **تم بنجاح إعادة **تشغيل الأمر`,
                            line: true,
                            footer: "Success.",
                            fields: "Success."
                        }, "Success");
                        if (BaseEmbed11) {
                            return interaction.editReply({
                                embeds: [BaseEmbed11]
                            });
                        }
                    }
                }
            }
        });
    }
}
exports.default = Test;
