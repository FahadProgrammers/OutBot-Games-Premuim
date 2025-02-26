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
class ajr extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("ajr")
                .setDescription("اجر | جزاك الله خير"),
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
            const embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                line: false,
                title: `صدقة جاريه`,
                footer: "System",
                fields: `
          الله يرحمه ويغفر له ويغفر له ويسكنه فسيح جناته
    
          [تبرع الآن](https://ehsan.sa/campaign/1E29E00C61)
    
          عن أبي هُريرة رضي الله عنه : أَنَّ رسولَ اللَّه ﷺ قَالَ: مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ للَّهِ إِلَّا رَفَعَهُ اللّهُ عز وجل
        `,
            }, "Base");
            if (embed) {
                yield interaction.editReply({
                    embeds: [
                        embed
                    ],
                });
            }
        });
    }
}
exports.default = ajr;
