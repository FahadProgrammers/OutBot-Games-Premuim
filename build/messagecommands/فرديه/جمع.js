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
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const jm3_1 = __importDefault(require("../../utils/games/jm3"));
const canvas_1 = __importDefault(require("canvas"));
const path_1 = __importDefault(require("path"));
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
class جمع extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "جمع",
            description: "لعبه جمع ( جمع الكلمه )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["تجميع"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomKey = Object.keys(jm3_1.default)[Math.floor(Math.random() * Object.keys(jm3_1.default).length)];
            const randomValue = jm3_1.default[randomKey];
            const Canvas = canvas_1.default.createCanvas(700, 250);
            const ctx = Canvas.getContext("2d");
            const filePath = path_1.default.resolve("assets", "BOTBG.png");
            yield canvas_1.default
                .loadImage(filePath)
                .then((image) => __awaiter(this, void 0, void 0, function* () {
                canvas_1.default.registerFont(path_1.default.resolve("assets", "imagefont.ttf"), {
                    family: "ImageFont",
                });
                ctx.drawImage(image, 0, 0, Canvas.width, Canvas.height);
                //Text
                ctx.font = "25px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText("✧ اجمع الكلمه قبل إنتهاء الوقت ✧", 165, 180);
                //Time
                ctx.font = "25px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText("5", 60, 235);
                //Word
                ctx.font = "25px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText(randomKey, 320, 115); // x 350
            }))
                .catch((err) => {
                console.log(err);
            });
            const messageFetch = yield message.reply({
                files: [Canvas.toBuffer()],
            });
            const time_1 = Date.now();
            let status = false;
            try {
                yield (0, MessageCollecter_1.default)(messageFetch, randomKey, randomValue, time_1);
            }
            catch (err) {
                console.log("Error of Collecter!!");
            }
        });
    }
}
exports.default = جمع;
