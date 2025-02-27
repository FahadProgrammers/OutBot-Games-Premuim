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
const success_1 = __importDefault(require("../../utils/games/success"));
const qs_football_json_1 = __importDefault(require("../../utils/games/qs_football.json"));
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class football extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "كوره",
            description: "اسئله في عالم الكوره.",
            category: Category_1.default.فرديه,
            cooldown: 3,
            aliases: ["football", "اسئله كرويه", "أسئله كرويه"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomword_1_1 = Math.floor(Math.random() * success_1.default.length);
            const randomword_1_2 = success_1.default[randomword_1_1];
            const randomKey2 = Object.keys(qs_football_json_1.default.words)[Math.floor(Math.random() * Object.keys(qs_football_json_1.default.words).length)];
            let randomword_2_2 = qs_football_json_1.default.words[randomKey2];
            if (!message.guild)
                return;
            const base = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                line: false,
                des: "##" + randomword_2_2.qs,
                title: "**اسئله** كرويه ⚽",
                footer: "⚽",
                fields: "⚽",
            }, "Base");
            if (base) {
                const messageFetch = yield message.reply({
                    embeds: [base]
                });
                const time_1 = Date.now();
                let status = false;
                try {
                    yield (0, MessageCollecter_1.default)(this.client, messageFetch, randomword_2_2.jwab, time_1);
                }
                catch (err) {
                    console.log("Error of Collecter!!");
                }
            }
        });
    }
}
exports.default = football;
