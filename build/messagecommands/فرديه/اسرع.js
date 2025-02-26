"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const success_1 = __importDefault(require("../../utils/games/success"));
const words_json_1 = __importDefault(require("../../utils/games/words.json"));
const canvas_1 = __importStar(require("canvas"));
const path_1 = __importDefault(require("path"));
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
const SchemaTheme_1 = __importDefault(require("../../schema/SchemaTheme"));
class اسرع extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "اسرع",
            description: "لعبه اسرع ( اسرع إجابه )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["speed"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const randomword_1_1 = Math.floor(Math.random() * success_1.default.length);
            const randomword_1_2 = success_1.default[randomword_1_1];
            const wordsss = yield words_json_1.default.words;
            const randomword_2_2 = wordsss[Math.floor(Math.random() * words_json_1.default.words.length)];
            const Canvas = canvas_1.default.createCanvas(700, 250);
            const ctx = Canvas.getContext("2d");
            const f = yield SchemaTheme_1.default.findOne({
                guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id
            });
            let filePath = path_1.default.resolve("src/utils/assets", "BOTBG.png");
            if (f) {
                switch (f.theme) {
                    case "1":
                        filePath = path_1.default.resolve("src/utils/assets/Themes", "OutBot_Games_Background1.png");
                        break;
                    case "2":
                        filePath = path_1.default.resolve("src/utils/assets/Themes", "OutBot_Games_Background2.png");
                        break;
                }
            }
            yield (0, canvas_1.loadImage)(filePath)
                .then((image) => __awaiter(this, void 0, void 0, function* () {
                canvas_1.default.registerFont(path_1.default.resolve("src/utils/assets/Fonts", "alfont_com_Wafeq-SemiBold.otf"), {
                    family: "ImageFont",
                });
                ctx.drawImage(image, 0, 0, Canvas.width, Canvas.height);
                //Text
                ctx.font = "27px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText("اكتب الكلمه قبل إنتهاء الوقت", 165, 180);
                //Time
                ctx.font = "25px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText("5", 60, 235);
                //Word
                ctx.font = "25px ImageFont";
                ctx.fillStyle = "White";
                ctx.fillText(randomword_2_2, 320, 115); // x 350
            }))
                .catch((err) => {
                console.log(err);
            });
            const messageFetch = yield message.reply({
                files: [Canvas.toBuffer()
                ],
            });
            const time_1 = Date.now();
            let status = false;
            try {
                yield (0, MessageCollecter_1.default)(this.client, messageFetch, randomword_2_2, time_1);
            }
            catch (err) {
                console.log("Error of Collecter!!");
            }
        });
    }
}
exports.default = اسرع;
