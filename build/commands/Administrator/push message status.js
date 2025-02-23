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
const SchemaPushStatus_1 = __importDefault(require("../../schema/SchemaPushStatus"));
class push extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("update")
                .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommandGroup((sub) => sub
                .setName("message")
                .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)
                .addSubcommand((command) => command
                .setName('status')
                .setDescription(`تقعيل/إغلاق حالة إرسال رسائل التحديثات في روم الألعاب.`)
                .addStringOption((string) => string
                .setName("status")
                .setRequired(true)
                .addChoices({ name: "تفعيل", value: "on" }, { name: "إلغاء تفعيل", value: "off" })
                .setDescription("تفعيل/اغلاق حالة رسائل التحديثات.")))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield interaction.deferReply({ ephemeral: true });
                const status = interaction.options.getString("status");
                const guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
                if (!guildId) {
                    return interaction.editReply({
                        content: `${emojis_1.default.false} | حدث خطأ ما!`,
                    });
                }
                const query = yield SchemaPushStatus_1.default.findOne({
                    guildId,
                });
                if (status === "on") {
                    if (query) {
                        return interaction.editReply({
                            content: `التحديثات مفعلة بالفعل لهذه القناة!`,
                        });
                    }
                    yield SchemaPushStatus_1.default.create({
                        guildId,
                    });
                    return interaction.editReply({
                        content: `تم تفعيل التحديثات بنجاح! | ${emojis_1.default.true}`,
                    });
                }
                if (status === "off") {
                    if (!query) {
                        return interaction.editReply({
                            content: `التحديثات غير مفعلة لهذه القناة!`,
                        });
                    }
                    yield SchemaPushStatus_1.default.deleteOne({
                        guildId,
                    });
                    return interaction.editReply({
                        content: `تم إلغاء تفعيل التحديثات بنجاح! | ${emojis_1.default.true}`,
                    });
                }
            }
            catch (error) {
                console.error("An unexpected error occurred : /push command", error);
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Error")
                    .setDescription("Error. Please try again later.");
                return interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
exports.default = push;
