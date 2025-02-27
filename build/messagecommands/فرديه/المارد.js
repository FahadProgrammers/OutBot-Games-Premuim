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
const discord_js_akinator_1 = __importDefault(require("discord.js-akinator"));
class جمع extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "المارد",
            description: "لعبه المارد الازرق )",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: [],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, discord_js_akinator_1.default)(message, {
                    language: "ar",
                    childMode: true,
                    useButtons: true,
                    embedColor: "Red",
                    translationCaching: {
                        enabled: false
                    }
                });
            }
            catch (err) {
                console.log("Error of Collecter!!");
            }
        });
    }
}
exports.default = جمع;
