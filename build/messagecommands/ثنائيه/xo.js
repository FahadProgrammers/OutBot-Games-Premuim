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
const discord_tictactoe_1 = __importDefault(require("discord-tictactoe"));
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class xo extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "اكس.او",
            description: "لعبه xo",
            category: Category_1.default.ثنائيه,
            cooldown: 3,
            aliases: ["اكس-او", "XO", "xo"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const args = yield message.content.split(" ");
            let aiDifficulty;
            if (!((_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first())) {
                switch (args[1]) {
                    case "سهل":
                        aiDifficulty = "Easy";
                        break;
                    case "متوسط":
                        aiDifficulty = "Medium";
                        break;
                    case "صعب":
                        aiDifficulty = "Hard";
                        break;
                    case "صعب جدا":
                        aiDifficulty = "Unbeatable";
                        break;
                    default:
                        aiDifficulty = "Easy";
                        break;
                }
            }
            else {
                aiDifficulty = "Easy";
            }
            const game = new discord_tictactoe_1.default({
                language: "ar",
                aiDifficulty: aiDifficulty !== null && aiDifficulty !== void 0 ? aiDifficulty : "Easy",
            });
            game.handleMessage(message);
        });
    }
}
exports.default = xo;
