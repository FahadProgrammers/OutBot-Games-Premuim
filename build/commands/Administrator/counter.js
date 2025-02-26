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
const SchemaCounter_1 = __importDefault(require("../../schema/SchemaCounter"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
class Test extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("counter")
                .setDescription("counter...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command
                .setName("add")
                .setDescription(`إعداد الروم الخاص ب لعبة العد.`)
                .addChannelOption((option) => option
                .setName("channel")
                .setDescription("عين القناه المراد اختيارها")
                .setRequired(true)
                .addChannelTypes(discord_js_1.ChannelType.GuildText)))
                .addSubcommand((command) => command
                .setName('delete')
                .setDescription(`إزالة الروم الخاص ب لعبة العد.`)
                .addStringOption((option) => option
                .setName("remove")
                .setDescription("عين القناه المراد إزالتها")
                .setRequired(true)
                .setAutocomplete(true))
                .addRoleOption((role) => role
                .setName('admim')
                .setDescription("تحديد رول مايتم مسح رسائله.")
                .setRequired(false))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const subCommand = interaction.options.getSubcommand();
            yield interaction.deferReply({
                ephemeral: true,
            });
            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                return interaction.editReply({
                    content: `${emojis_1.default.false} | ?`,
                });
            }
            if (subCommand === "delete") {
                const Targetchannel = interaction.options.getString("remove");
                const data = (yield SchemaCounter_1.default.findOne({
                    guildId: interaction.guild.id,
                    channelId: Targetchannel
                })) || null;
                const emb2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "حدث خطا!",
                    des: `❌ تاكد من اختيار عنصر صحيح او متوفر بقاعده البيانات `,
                    line: false,
                    footer: "Error.",
                    fields: "Error."
                }, "Base");
                if (emb2) {
                    if (Targetchannel === "") {
                        yield interaction.editReply({
                            embeds: [emb2],
                        });
                        return;
                    }
                    if (data && data.channelId) {
                        yield (data === null || data === void 0 ? void 0 : data.deleteOne());
                    }
                    if (interaction.guild) {
                        const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                            title: "deletecounter",
                            des: `${emojis_1.default.true} تم حذف القناه <#${Targetchannel}>`,
                            line: true,
                            footer: `حذف قناه`,
                            fields: `حذف قناه`,
                        }, "Success");
                        if (emb) {
                            yield interaction.editReply({
                                embeds: [emb],
                            });
                        }
                    }
                }
            }
            else if (subCommand === "add") {
                const channel = interaction.options.getChannel("channel");
                const role = interaction.options.getRole('role');
                const schema_2 = (yield SchemaCounter_1.default.findOne({
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                })) || null;
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: "setcounter",
                    des: `${emojis_1.default.true} | تم بنجاح اضافه قناة لعبة العد`,
                    line: true,
                    footer: `#${channel.name}`,
                    fields: `#${channel.name}`,
                }, "Success");
                if (emb) {
                    const emb2 = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        des: `${emojis_1.default.false} | هاذي القناه مضافه بلفعل`,
                        line: false,
                        footer: 'Error.',
                        fields: "Error."
                    }, "Error");
                    const emb2Full = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                        des: `
      ${emojis_1.default.false} | مهلا لقد وصلت الحد الاقصى ل القنوات **${schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.length} **
      للمزيد اشترك في [النسخه المطوره](https://discord.com/channels/1198628254043607070/1256976756485652480) 
        `,
                        line: false,
                        footer: 'Error.',
                        fields: "Error."
                    }, "Error");
                    if (schema_2 && emb2) {
                        if (schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.includes(channel.id)) {
                            yield interaction.editReply({
                                embeds: [emb2],
                            });
                            return;
                        }
                        if (!((_c = channel.permissionsFor(interaction.client.user)) === null || _c === void 0 ? void 0 : _c.has(["ViewChannel", "SendMessages"]))) {
                            const emb2Full = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                des: `⚠️ لا يمكنني رؤية هذه القناة أو الكتابة بها. تأكد من إعطائي الأذونات الصحيحة.`,
                                line: false,
                                footer: 'Error.',
                                fields: "Error."
                            }, "Error");
                            if (emb2Full) {
                                return yield interaction.editReply({ embeds: [emb2Full] });
                            }
                        }
                        if (schema_2) {
                            schema_2.channelId = channel.id.toString();
                            if (role) {
                                schema_2.roleId = role.id;
                            }
                            schema_2.count = 0;
                            yield (schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.save());
                            yield interaction.editReply({
                                embeds: [emb],
                            });
                        }
                    }
                    else {
                        if (!((_d = channel.permissionsFor(interaction.client.user)) === null || _d === void 0 ? void 0 : _d.has(["ViewChannel", "SendMessages"]))) {
                            const emb2Full = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                                des: `⚠️ لا يمكنني رؤية هذه القناة أو الكتابة بها. تأكد من إعطائي الأذونات الصحيحة.`,
                                line: false,
                                footer: 'Error.',
                                fields: "Error."
                            }, "Error");
                            if (emb2Full) {
                                return yield interaction.editReply({ embeds: [emb2Full] });
                            }
                        }
                        if (role) {
                            new SchemaCounter_1.default({
                                guildId: interaction.guild.id,
                                channelId: channel.id,
                                roleId: role.id
                            }).save();
                        }
                        else {
                            new SchemaCounter_1.default({
                                guildId: interaction.guild.id,
                                channelId: channel.id,
                            }).save();
                        }
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                    const message = yield channel.send({
                        content: `
      <:confetti_2:1343040164183674900> **تم بإذن الله تفعيل لعبة العد في هاذي القناه.**`,
                        components: [],
                    });
                    if ((_e = message.guild.members.me) === null || _e === void 0 ? void 0 : _e.permissions.has("ManageGuild")) {
                        yield message.pin();
                    }
                }
            }
        });
    }
}
exports.default = Test;
