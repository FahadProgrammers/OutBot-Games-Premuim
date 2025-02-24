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
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class top extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "لوحة النقاط",
            description: "ترتيب لوحة النقاط.",
            category: Category_1.default.ادمن,
            cooldown: 3,
            aliases: ["النقاط", "توب", "top"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                if (!message.guild) {
                    return;
                }
                const embed = (0, BaseEmbed_1.default)(message.guild, {
                    title: "لوحة التوب",
                    des: `<:number1:1343223920790212638> - **إضهار التوب **الخاص بلسيرفر
<:number2:1343223935415746621> - **إضهار اعلى اشخاص **يملكون نقاطا 
<:number3:1343223947705192468> - **إضهار التوب الخاص ب أكثر **سيرفر اُستخدم فيه البوت`,
                    line: false,
                    footer: "التوب",
                    fields: "التوب"
                }, "Base");
                if (embed) {
                    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setEmoji("<:number1:1343223920790212638>")
                        .setCustomId(`topserver_${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}`)
                        .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                        .setEmoji("<:number2:1343223935415746621>")
                        .setCustomId(`pall_${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.id}`)
                        .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                        .setEmoji("<:number3:1343223947705192468>")
                        .setCustomId(`serverused_${(_c = message.guild) === null || _c === void 0 ? void 0 : _c.id}`)
                        .setStyle(discord_js_1.ButtonStyle.Secondary));
                    message.reply({ embeds: [embed], components: [row] });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = top;
