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
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const mainEmbed_1 = __importDefault(require("../../utils/embeds/mainEmbed"));
class top extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "top",
            description: "ترتيب لوحة النقاط.",
            category: Category_1.default.ادمن,
            cooldown: 3,
            aliases: ["لوحة النقاط", "توب"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const embed = (0, mainEmbed_1.default)(`<:Arrow1:1299711671052402718> لوحة النقاط
        
اختر من الخيارات ادناه ماتريد
1. إضهار التوب الخاص بلسيرفر
2. إضهار اعلى اشخاص يملكون نقاطا `, "System", "System");
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setEmoji("<:one:1309821400424644649>")
                .setCustomId(`topserver_${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}`)
                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                .setEmoji("<:two:1309821436503920691>")
                .setCustomId(`pall_${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.id}`)
                .setStyle(discord_js_1.ButtonStyle.Secondary));
            message.reply({ embeds: [embed], components: [row] });
        });
    }
}
exports.default = top;
