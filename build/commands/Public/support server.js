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
const utils_1 = __importDefault(require("../../utils/utils"));
class ajr extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("suppprt")
                .setDescription("رابط الدعم الفني")
                .addSubcommand((command) => command
                .setName('server')
                .setDescription("رابط الدعم الفني")),
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
            const Embd = (0, BaseEmbed_1.default)(interaction.guild, {
                title: "Support Server",
                des: `
<:1323739617790263326:1341704260483551323> [الدعم الفني](${utils_1.default.SupportServer})
`,
                line: false,
                footer: "Support",
                fields: "Support"
            }, "Base");
            if (Embd) {
                const btn = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel('الدعم الفني')
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(utils_1.default.SupportServer));
                yield interaction.editReply({
                    embeds: [Embd],
                    components: [btn]
                });
            }
        });
    }
}
exports.default = ajr;
