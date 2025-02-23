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
const SchemaPrefix_1 = __importDefault(require("../../schema/SchemaPrefix"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const warnembed_1 = __importDefault(require("../../utils/embeds/warnembed"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
class prefix extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("prefix")
                .setDescription("prefix...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command.setName('add').setDescription(`إعداد بريفكس روم الألعاب`)
                .addStringOption((option) => option
                .setName("channel")
                .setDescription("اختار قناه البادئه المراد اضافتها")
                .setRequired(true)
                .setAutocomplete(true))
                .addStringOption((option) => option
                .setName("prefix")
                .setDescription("اختار البادئه المراد اضافتها")
                .setRequired(true)))
                .addSubcommand((command) => command
                .setName('remove')
                .setDescription('إزالة بريفكس روم الألعاب')
                .addStringOption((option) => option
                .setName("delprefix")
                .setDescription("اختار قناه البادئه المراد ازالتها")
                .setRequired(true)
                .setAutocomplete(true))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { options } = interaction;
                const subCommand = interaction.options.getSubcommand();
                if (subCommand === "remove") {
                    const prefix = options.getString("delprefix");
                    const prefixx = prefix === null || prefix === void 0 ? void 0 : prefix.split("_");
                    if (interaction.guild && prefixx) {
                        const emb = (0, BaseEmbed_1.default)(interaction.guild, {
                            title: "deleteprefix",
                            des: `${emojis_1.default.true} | تم بنجاح إزالة البادئه ( \` ${prefixx[0]} \` )`,
                            line: true,
                            footer: `حذف بادئه`,
                            fields: `حذف بادئه`,
                        }, "Success");
                        if (emb) {
                            const embnotfound = (0, warnembed_1.default)(`${emojis_1.default.false} | لا اتمكن من العثور بلفعل على بادئه مخصصه`);
                            yield interaction.deferReply({
                                ephemeral: true,
                            });
                            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                                return interaction.editReply({
                                    content: `${emojis_1.default.false} | ?`,
                                });
                            }
                            if (prefixx) {
                                let f = (yield SchemaPrefix_1.default.findOne({
                                    guildId: interaction.guild.id,
                                    channelId: prefixx[1],
                                })) || null;
                                const find = f === null || f === void 0 ? void 0 : f.prefix.find((data) => data === prefixx[0]);
                                if (f && find) {
                                    f.prefix = f.prefix.filter((channelId) => channelId !== prefixx[0]);
                                    yield (f === null || f === void 0 ? void 0 : f.save());
                                    if (f.prefix.length === 0) {
                                        console.log("فاضي");
                                        f.deleteOne();
                                    }
                                }
                                else {
                                    yield interaction.editReply({
                                        embeds: [embnotfound],
                                    });
                                    return;
                                }
                                yield interaction.editReply({
                                    embeds: [emb],
                                });
                            }
                        }
                    }
                }
                else if (subCommand === "add") {
                    const prefix = options.getString("prefix");
                    const channel = options.getString('channel');
                    if (channel) {
                        if (interaction.guild) {
                            const emb = (0, BaseEmbed_1.default)(interaction.guild, {
                                title: "setprefix",
                                des: `${emojis_1.default.true} | تم بنجاح تعيين البادئه ( \` ${prefix} \` )`,
                                line: false,
                                footer: "تعيين البادئه",
                                fields: "تعيين البادئه"
                            }, "Success");
                            yield interaction.deferReply({
                                ephemeral: true,
                            });
                            if (!((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id)) {
                                return interaction.editReply({
                                    content: `${emojis_1.default.false} | ?`,
                                });
                            }
                            const f = yield SchemaPrefix_1.default.findOne({
                                guildId: interaction.guild.id,
                                channelId: channel,
                            });
                            if (!f) {
                                new SchemaPrefix_1.default({
                                    guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                                    channelId: channel,
                                    prefix: [prefix],
                                }).save();
                            }
                            else {
                                if (prefix) {
                                    f.prefix.push(prefix);
                                    yield f.save();
                                }
                            }
                            if (emb) {
                                yield interaction.editReply({
                                    embeds: [emb],
                                });
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = prefix;
