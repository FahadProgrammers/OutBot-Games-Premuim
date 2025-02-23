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
const Events_1 = __importDefault(require("../../../base/classes/Events"));
const mainEmbed_1 = __importDefault(require("../../../utils/embeds/mainEmbed"));
class CommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Command Handler Event",
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton())
                return;
            if (interaction.customId === "rank_info") {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const emb = (0, mainEmbed_1.default)(`
                <:Arrow1:1299711671052402718> Devices Theme | مظهر الاجهزه

<:emoji_7:1300911919410188288> **0** - لاعب جديد
<:emoji_12:1300918782369337415> **50** - لاعب عادي
<:emoji_9:1300913649589944330>  **100** - لاعب فنان
<:emoji_11:1300914268585328761> **200** - لاعب رهيب
<:emoji_10:1300914252605030512> **400** - لاعب محترف
<:emoji_12:1300914637205667870> **600** - لاعب اسطوري
<:emoji_9:1300790146685472890> **1000** - ملك الالعاب`, "Rank", "Rank");
                yield interaction.editReply({
                    embeds: [emb],
                });
            }
        });
    }
}
exports.default = CommandHandler;
