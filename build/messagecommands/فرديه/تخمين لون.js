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
const color_json_1 = __importDefault(require("../../utils/games/color.json"));
const canvas_1 = require("canvas");
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class لون extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "لون",
            description: "تخمين لون ( لون النص )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["color"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const args = message.content.split(" ").slice(1);
                const randomKey = Object.keys(color_json_1.default.words)[Math.floor(Math.random() * Object.keys(color_json_1.default.words).length)];
                let randomValue = color_json_1.default.words[randomKey];
                const randomKey2 = Object.keys(color_json_1.default.words)[Math.floor(Math.random() * Object.keys(color_json_1.default.words).length)];
                let randomValue2 = color_json_1.default.words[randomKey];
                while (randomValue === randomValue2) {
                    randomValue2 = color_json_1.default.words[randomKey];
                }
                const randomKey3 = Object.keys(color_json_1.default)[Math.floor(Math.random() * Object.keys(color_json_1.default.words).length)];
                const canvas = (0, canvas_1.createCanvas)(114, 148);
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = randomValue;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = randomValue2;
                ctx.font = "25px Cairo";
                ctx.shadowBlur = 21;
                ctx.fillText(randomKey3, /* 40 */ 35, 75);
                const attach = new discord_js_1.AttachmentBuilder(canvas.toBuffer("image/png"), {
                    name: "image.png",
                });
                if (!message.guild)
                    return;
                const base = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                    line: false,
                    title: "خمن **لون النص**",
                    footer: "تخمين اللون",
                    fields: "تخمين اللون",
                }, "Base");
                if (base) {
                    base.setImage("attachment://image.png");
                    const messageFetch = yield message.reply({
                        embeds: [base],
                        files: [attach],
                    });
                    const time_1 = new Date().getTime();
                    let status = false;
                    try {
                        yield (0, MessageCollecter_1.default)(this.client, messageFetch, randomKey2, time_1);
                    }
                    catch (err) {
                        console.log("Error of Collecter!!");
                    }
                }
            }
            catch (err) {
                console.log(err, "In تخمين لون");
            }
        });
    }
}
exports.default = لون;
