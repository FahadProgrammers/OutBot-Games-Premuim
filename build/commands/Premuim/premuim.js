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
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const SchemaPremuim_1 = __importDefault(require("../../schema/SchemaPremuim"));
const SchemaEmbedColor_1 = __importDefault(require("../../schema/SchemaEmbedColor"));
const SchemaChannel_1 = __importDefault(require("../../schema/SchemaChannel"));
const path_1 = __importDefault(require("path"));
const SchemaTheme_1 = __importDefault(require("../../schema/SchemaTheme"));
class Test extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("premuim")
                .setDescription("premuim...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommandGroup((command) => command
                .setName("embed")
                .setDescription("إعداد بعض من خصائص الايمبد.")
                .addSubcommand((command) => command
                .setName('add')
                .setDescription('إعداد بعض من خصائص الايمبد.')
                .addStringOption((command) => command
                .setName('color')
                .setDescription('ضع رمز اللون ب مثال ) ( #ffffff ).')
                .setRequired(true)))
                .addSubcommand((cmd) => cmd
                .setName('remove')
                .setDescription('إزالة بعض من خصائص الايمبد.')))
                .addSubcommandGroup((Cmd) => Cmd
                .setName('game')
                .setDescription("اعدادات الالعاب.")
                .addSubcommand(cmd => cmd
                .setName('theme')
                .setDescription("اختيار الصوره المُرسله في اوامر الالعاب.")))
                .addSubcommandGroup((command) => command
                .setName("bot")
                .setDescription(`اضافة اسم البوت.`)
                .addSubcommand(cmd => cmd
                .setName('setbanner')
                .setDescription('اختيار بنر البوت.')
                .addStringOption(cmd => cmd
                .setName('avatar')
                .setDescription('ضع رابط البنر.')
                .setRequired(true)))
                .addSubcommand((cmd) => cmd
                .setName('setstatus')
                .setDescription('نحديد حالة البوت.')
                .addStringOption((cmd) => cmd
                .setName('status')
                .setDescription('نحديد حالة البوت.')
                .setRequired(true)
                .addChoices({ name: 'online', value: 'online' }, { name: 'dnd', value: 'dnd' }, { name: 'idle', value: 'idle' })))
                .addSubcommand((command) => command
                .setName('setname')
                .setDescription(`اضافة اسم البوت.`)
                .addStringOption((option) => option
                .setName("name")
                .setDescription("تعيين اسم البوت.")
                .setRequired(true)))
                .addSubcommand((command) => command
                .setName('setavatar')
                .setDescription(`اضافة صورة البوت.`)
                .addAttachmentOption((option) => option
                .setName("avatar")
                .setDescription("تعيين صورة البوت. ضع الرابط")
                .setRequired(true)))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            try {
                const subCommand = interaction.options.getSubcommand();
                const subCommandG = interaction.options.getSubcommandGroup();
                yield interaction.deferReply({
                    ephemeral: true,
                });
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return interaction.editReply({
                        content: `${emojis_1.default.false} | ?`,
                    });
                }
                const find = yield SchemaPremuim_1.default.findOne({
                    botId: (_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id
                });
                if (!find) {
                    yield interaction.editReply({
                        content: "امبوستر!"
                    });
                    return;
                }
                else {
                    if (find.owner !== interaction.user.id) {
                        const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | انت لست بمالك البوت ل التحكم فيه!`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        if (EmbedErr2) {
                            yield interaction.editReply({
                                embeds: [EmbedErr2]
                            });
                            return;
                        }
                    }
                }
                if (subCommandG === "bot" && subCommand === "setname") {
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const TargetName = interaction.options.getString("name");
                    const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                        return yield interaction.editReply({
                            embeds: [EmbedErr1]
                        });
                    }
                    if (EmbedErr2 && TargetName === "") {
                        yield interaction.editReply({
                            embeds: [EmbedErr2],
                        });
                        return;
                    }
                    try {
                        yield ((_c = this.client.user) === null || _c === void 0 ? void 0 : _c.setUsername(TargetName !== null && TargetName !== void 0 ? TargetName : "OutBot Games"));
                        const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح!",
                            des: `${emojis_1.default.true} | تم بنجاح **تغير الأسم**.`,
                            line: false,
                            footer: "تم بنجاح.",
                            fields: "تم بنجاح.",
                        }, "Success");
                        if (EmbedSuccess) {
                            yield interaction.editReply({ embeds: [EmbedSuccess] });
                            return;
                        }
                    }
                    catch (err) {
                        if (err.message.includes("too fast.") || err.status === 429) {
                            const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | "**لقد **قمت** بتغيير الاسم بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr) {
                                yield interaction.editReply({ embeds: [EmbedErr] });
                                return;
                            }
                        }
                        else if (err.message.includes("Invalid Username")) {
                            const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | "**الاسم **غير** صحيح - "**يرجى تعديله.`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr) {
                                yield interaction.editReply({ embeds: [EmbedErr] });
                                return;
                            }
                        }
                        else if (err.code === 50035 && err.message.includes("BASE_TYPE_BAD_LENGTH")) {
                            const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | الاسم يجب أن يكون **ما** بين **2** و **32** حرفًا!`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr) {
                                yield interaction.editReply({ embeds: [EmbedErr] });
                                return;
                            }
                        }
                        console.error("⚠️ خطأ غير متوقع:", err);
                    }
                }
                else if (subCommandG === "bot" && subCommand === "setavatar") {
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const TargetAvatar = interaction.options.getAttachment("avatar");
                    if (TargetAvatar) {
                        const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                            return yield interaction.editReply({
                                embeds: [EmbedErr1]
                            });
                        }
                        if (EmbedErr2 && TargetAvatar === null) {
                            yield interaction.editReply({
                                embeds: [EmbedErr2],
                            });
                            return;
                        }
                        try {
                            yield ((_d = this.client.user) === null || _d === void 0 ? void 0 : _d.setAvatar((_e = TargetAvatar.url) !== null && _e !== void 0 ? _e : emojis_1.default.BaseURL));
                            const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "تم بنجاح!",
                                des: `${emojis_1.default.true} | تم بنجاح **تغير الصوره**.`,
                                line: false,
                                footer: "تم بنجاح.",
                                fields: "تم بنجاح.",
                            }, "Success");
                            if (EmbedSuccess) {
                                yield interaction.editReply({ embeds: [EmbedSuccess] });
                                return;
                            }
                        }
                        catch (err) {
                            if (err.message.includes("too fast.") || err.status === 429) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                            else if (err.message.includes("Invalid Avatar")) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                        }
                    }
                }
                else if (subCommandG === "embed" && subCommand === "add") {
                    const find = yield SchemaPremuim_1.default.findOne({
                        botId: (_f = this.client.user) === null || _f === void 0 ? void 0 : _f.id
                    });
                    if (!find) {
                        yield interaction.editReply({
                            content: "امبوستر!"
                        });
                        return;
                    }
                    else {
                        if (find.owner !== interaction.user.id) {
                            const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | انت لست بمالك البوت ل التحكم فيه!`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr2) {
                                yield interaction.editReply({
                                    embeds: [EmbedErr2]
                                });
                                return;
                            }
                        }
                    }
                    const color = interaction.options.getString('color');
                    if (color) {
                        yield SchemaEmbedColor_1.default.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            embedcolor: color.startsWith("#") ? color : "#" + color
                        }, { upsert: true, new: true });
                    }
                    const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "تم بنجاح!",
                        des: `${emojis_1.default.true} | تم بنجاح تنفيذ المطلوب!`,
                        line: false,
                        footer: "Success.",
                        fields: "Success."
                    }, "Success");
                    if (embed) {
                        yield interaction.editReply({
                            embeds: [embed]
                        });
                    }
                }
                else if (subCommandG === "embed" && subCommand === "remove") {
                    yield SchemaEmbedColor_1.default.findOneAndDelete({ guildId: interaction.guild.id }).catch(() => { });
                    const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "تم بنجاح!",
                        des: `${emojis_1.default.true} | تم بنجاح تنفيذ المطلوب!`,
                        line: false,
                        footer: "Success.",
                        fields: "Success."
                    }, "Success");
                    if (embed) {
                        yield interaction.editReply({
                            embeds: [embed]
                        });
                    }
                }
                if (subCommandG === "bot" && subCommand === "setstatus") {
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const TargetStatus = interaction.options.getString("status");
                    const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                        return yield interaction.editReply({
                            embeds: [EmbedErr1]
                        });
                    }
                    if (EmbedErr2 && TargetStatus === null) {
                        yield interaction.editReply({
                            embeds: [EmbedErr2],
                        });
                        return;
                    }
                    try {
                        (_g = this.client.user) === null || _g === void 0 ? void 0 : _g.setStatus(TargetStatus !== null && TargetStatus !== void 0 ? TargetStatus : "online");
                        const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "تم بنجاح!",
                            des: `${emojis_1.default.true} | تم بنجاح **تغير الحاله**.`,
                            line: false,
                            footer: "تم بنجاح.",
                            fields: "تم بنجاح.",
                        }, "Success");
                        if (EmbedSuccess) {
                            yield interaction.editReply({ embeds: [EmbedSuccess] });
                            return;
                        }
                    }
                    catch (err) {
                        if (err.message.includes("too fast.") || err.status === 429) {
                            const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | "**لقد **قمت** بتغيير الحاله بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr) {
                                yield interaction.editReply({ embeds: [EmbedErr] });
                                return;
                            }
                        }
                        else if (err.message.includes("Invalid Status")) {
                            const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | "**الحاله **غير** صحيحه - "**يرجى تعديله.`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr) {
                                yield interaction.editReply({ embeds: [EmbedErr] });
                                return;
                            }
                        }
                    }
                }
                else if (subCommandG === "bot" && subCommand === "setavatar") {
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const TargetAvatar = interaction.options.getAttachment("avatar");
                    if (TargetAvatar) {
                        const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                            return yield interaction.editReply({
                                embeds: [EmbedErr1]
                            });
                        }
                        if (EmbedErr2 && TargetAvatar === null) {
                            yield interaction.editReply({
                                embeds: [EmbedErr2],
                            });
                            return;
                        }
                        try {
                            yield ((_h = this.client.user) === null || _h === void 0 ? void 0 : _h.setAvatar((_j = TargetAvatar.url) !== null && _j !== void 0 ? _j : emojis_1.default.BaseURL));
                            const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "تم بنجاح!",
                                des: `${emojis_1.default.true} | تم بنجاح **تغير الصوره**.`,
                                line: false,
                                footer: "تم بنجاح.",
                                fields: "تم بنجاح.",
                            }, "Success");
                            if (EmbedSuccess) {
                                yield interaction.editReply({ embeds: [EmbedSuccess] });
                                return;
                            }
                        }
                        catch (err) {
                            if (err.message.includes("too fast.") || err.status === 429) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                            else if (err.message.includes("Invalid Avatar")) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                        }
                    }
                }
                else if (subCommandG === "embed" && subCommand === "add") {
                    const find = yield SchemaPremuim_1.default.findOne({
                        botId: (_k = this.client.user) === null || _k === void 0 ? void 0 : _k.id
                    });
                    if (!find) {
                        yield interaction.editReply({
                            content: "امبوستر!"
                        });
                        return;
                    }
                    else {
                        if (find.owner !== interaction.user.id) {
                            const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | انت لست بمالك البوت ل التحكم فيه!`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr2) {
                                yield interaction.editReply({
                                    embeds: [EmbedErr2]
                                });
                                return;
                            }
                        }
                    }
                    const color = interaction.options.getString('color');
                    if (color) {
                        yield SchemaEmbedColor_1.default.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            embedcolor: color.startsWith("#") ? color : "#" + color
                        }, { upsert: true, new: true });
                    }
                    const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "تم بنجاح!",
                        des: `${emojis_1.default.true} | تم بنجاح تنفيذ المطلوب!`,
                        line: false,
                        footer: "Success.",
                        fields: "Success."
                    }, "Success");
                    if (embed) {
                        yield interaction.editReply({
                            embeds: [embed]
                        });
                    }
                }
                else if (subCommandG === "bot" && subCommand === "setbanner") {
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const TargetBanner = interaction.options.getAttachment("banner");
                    if (TargetBanner) {
                        const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | تأكد من الصوره المعطى أو أن البوت صحيح!`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "مهلا!",
                            des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                            line: false,
                            footer: "Error.",
                            fields: "Error.",
                        }, "Error");
                        if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                            return yield interaction.editReply({
                                embeds: [EmbedErr1]
                            });
                        }
                        if (EmbedErr2 && TargetBanner === null) {
                            yield interaction.editReply({
                                embeds: [EmbedErr2],
                            });
                            return;
                        }
                        try {
                            yield ((_l = this.client.user) === null || _l === void 0 ? void 0 : _l.setAvatar((_m = TargetBanner.url) !== null && _m !== void 0 ? _m : emojis_1.default.BaseURL));
                            const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "تم بنجاح!",
                                des: `${emojis_1.default.true} | تم بنجاح **تغير البنر**.`,
                                line: false,
                                footer: "تم بنجاح.",
                                fields: "تم بنجاح.",
                            }, "Success");
                            if (EmbedSuccess) {
                                yield interaction.editReply({ embeds: [EmbedSuccess] });
                                return;
                            }
                        }
                        catch (err) {
                            if (err.message.includes("too fast.") || err.status === 429) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                            else if (err.message.includes("Invalid Avatar")) {
                                const EmbedErr = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                    title: "مهلا!",
                                    des: `${emojis_1.default.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`,
                                    line: false,
                                    footer: "Error.",
                                    fields: "Error.",
                                }, "Error");
                                if (EmbedErr) {
                                    yield interaction.editReply({ embeds: [EmbedErr] });
                                    return;
                                }
                            }
                        }
                    }
                }
                else if (subCommandG === "game" && subCommand === "time") {
                    const find = yield SchemaPremuim_1.default.findOne({
                        botId: (_o = this.client.user) === null || _o === void 0 ? void 0 : _o.id
                    });
                    if (!find) {
                        yield interaction.editReply({
                            content: "امبوستر!"
                        });
                        return;
                    }
                    else {
                        if (find.owner !== interaction.user.id) {
                            const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | انت لست بمالك البوت ل التحكم فيه!`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr2) {
                                yield interaction.editReply({
                                    embeds: [EmbedErr2]
                                });
                                return;
                            }
                        }
                    }
                    const TargetTime = interaction.options.getNumber("time");
                    const data = (yield SchemaPremuim_1.default.findOne({
                        guildId: interaction.guild.id,
                    })) || null;
                    const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | يجب ان يكون الوقت المعطى اكبر من **4** ثوان`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    const EmbedErr1 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "مهلا!",
                        des: `${emojis_1.default.false} | انت **لست** مالك **هاذا البوت**.`,
                        line: false,
                        footer: "Error.",
                        fields: "Error.",
                    }, "Error");
                    if (EmbedErr1 && data && data.owner !== interaction.user.id) {
                        return yield interaction.editReply({
                            embeds: [EmbedErr1]
                        });
                    }
                    if (TargetTime)
                        if (EmbedErr2 && 4 > TargetTime) {
                            yield interaction.editReply({
                                embeds: [EmbedErr2],
                            });
                            return;
                        }
                    yield SchemaChannel_1.default.findOneAndUpdate({
                        guildId: (_p = interaction.guild) === null || _p === void 0 ? void 0 : _p.id,
                        channelId: { $in: (_q = interaction.channel) === null || _q === void 0 ? void 0 : _q.id }
                    }, {
                        time: TargetTime
                    }, { upsert: true, new: true });
                    const EmbedSuccess = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        title: "تم بنجاح!",
                        des: `${emojis_1.default.true} | تم بنجاح **تعيين الوقت.**.`,
                        line: false,
                        footer: "تم بنجاح.",
                        fields: "تم بنجاح.",
                    }, "Success");
                    if (EmbedSuccess) {
                        yield interaction.editReply({ embeds: [EmbedSuccess] });
                        return;
                    }
                }
                else if (subCommandG === "game" && subCommand === "theme") {
                    const findd = yield SchemaPremuim_1.default.findOne({
                        botId: (_r = this.client.user) === null || _r === void 0 ? void 0 : _r.id
                    });
                    if (!findd) {
                        yield interaction.editReply({
                            content: "امبوستر!"
                        });
                        return;
                    }
                    else {
                        if (findd.owner !== interaction.user.id) {
                            const EmbedErr2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "مهلا!",
                                des: `${emojis_1.default.false} | انت لست بمالك البوت ل التحكم فيه!`,
                                line: false,
                                footer: "Error.",
                                fields: "Error.",
                            }, "Error");
                            if (EmbedErr2) {
                                yield interaction.editReply({
                                    embeds: [EmbedErr2]
                                });
                                return;
                            }
                        }
                    }
                    let color = "Red";
                    const find = yield SchemaEmbedColor_1.default.findOne({ guildId: (_s = interaction.guild) === null || _s === void 0 ? void 0 : _s.id });
                    if (find) {
                        color = find.embedcolor;
                    }
                    const Embed1 = new discord_js_1.EmbedBuilder()
                        .setTitle("**1**")
                        .setColor(color)
                        .setImage('attachment://theme_1.png');
                    const Embed2 = new discord_js_1.EmbedBuilder()
                        .setTitle("**2**")
                        .setColor(color)
                        .setImage('attachment://theme_2.png');
                    const res1 = path_1.default.resolve("src/utils/assets/Themes", "OutBot_Games_Background1.png");
                    const res2 = path_1.default.resolve("src/utils/assets/Themes", "OutBot_Games_Background2.png");
                    const attach1 = new discord_js_1.AttachmentBuilder(res1, { name: "theme_1.png" });
                    const attach2 = new discord_js_1.AttachmentBuilder(res2, { name: "theme_2.png" });
                    const btns = new discord_js_1.ActionRowBuilder()
                        .addComponents(new discord_js_1.ButtonBuilder()
                        .setLabel('1')
                        .setCustomId('1_theme')
                        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                        .setLabel('2')
                        .setCustomId('2_theme')
                        .setStyle(discord_js_1.ButtonStyle.Primary));
                    const msg = yield interaction.editReply({
                        embeds: [Embed1, Embed2],
                        files: [attach1, attach2],
                        components: [btns]
                    });
                    const collector = msg.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, time: 15000 });
                    collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        if (i.user.id === interaction.user.id && interaction.guild) {
                            const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                title: "تم بنجاح!",
                                des: "تم بنجاح تعيين الثيم!",
                                line: false,
                                fields: "Success.",
                                footer: "Success.",
                            }, "Success");
                            if (emb) {
                                btns.components[0].setDisabled(true);
                                btns.components[1].setDisabled(true);
                                i.reply({ embeds: [emb], flags: discord_js_1.MessageFlags.Ephemeral });
                                yield SchemaTheme_1.default.findOneAndUpdate({
                                    guildId: interaction.guild.id
                                }, {
                                    theme: i.customId.split("_")[0],
                                }, { upsert: true, new: true });
                            }
                        }
                        else {
                            i.reply({ content: `These buttons aren't for you!`, flags: discord_js_1.MessageFlags.Ephemeral });
                        }
                    }));
                    collector.on('end', collected => {
                    });
                }
            }
            catch (err) {
                console.log('Error to /premuim', err);
            }
        });
    }
}
exports.default = Test;
