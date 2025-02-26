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
const youtubers_1 = __importDefault(require("../../utils/games/youtubers"));
const path_1 = __importDefault(require("path"));
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class جمع extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "خمن اليوتيوبر",
            description: "لعبه خمن اليوتيوبر ( من صورته )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["يوتيوبر", "يوتيوبرز"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomKey = Object.keys(youtubers_1.default)[Math.floor(Math.random() * Object.keys(youtubers_1.default).length)];
            const randomValue = youtubers_1.default[randomKey];
            const ff = path_1.default.resolve("src/utils/Youtubers", randomValue);
            const attach = new discord_js_1.AttachmentBuilder(ff, { name: `image.png` });
            if (!message.guild)
                return;
            const base = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                line: false,
                title: "خمن **لون اليوتيوبر**",
                footer: "تخمين اليوتيوبر",
                fields: "تخمين اليوتيوبر",
            }, "Base");
            if (base) {
                base.setImage('attachment://image.png');
                const messageFetch = yield message.reply({
                    embeds: [base],
                    files: [attach],
                });
                const time_1 = new Date().getTime();
                let status = false;
                try {
                    yield (0, MessageCollecter_1.default)(this.client, messageFetch, randomKey, time_1);
                }
                catch (err) {
                    console.log("Error of Collecter!!");
                }
            }
        });
    }
}
exports.default = جمع;
