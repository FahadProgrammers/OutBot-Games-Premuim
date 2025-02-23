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
const kt_1 = __importDefault(require("../../utils/games/kt"));
const canvas_1 = __importDefault(require("canvas"));
const path_1 = __importDefault(require("path"));
class كت extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "كت",
            description: "لعبه كت ( سؤال وجواب )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["kt"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomword_1 = Math.floor(Math.random() * kt_1.default.length);
            const randomword_2 = kt_1.default[randomword_1];
            const Canvas = canvas_1.default.createCanvas(700, 250);
            const ctx = Canvas.getContext("2d");
            const filePath = path_1.default.resolve("assets", "BOTBNGNOROBOT.png");
            const attach = new discord_js_1.AttachmentBuilder(Canvas.toBuffer("image/png"), {
                name: "image.png",
            });
            yield message.reply({
                content: randomword_2,
            });
        });
    }
}
exports.default = كت;
