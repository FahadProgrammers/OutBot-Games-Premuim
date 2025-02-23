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
const SchemaUsers_1 = __importDefault(require("../../../schema/SchemaUsers"));
const rank_1 = __importDefault(require("../../../utils/functions/rank"));
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
            var _a;
            if (!interaction.isButton())
                return;
            if (interaction.customId === `pall_${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id}`) {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const schemaFindAll = yield SchemaUsers_1.default.find();
                const top10PointsAll = schemaFindAll
                    .sort((a, b) => b.p - a.p)
                    .map((entry, index) => {
                    const rankDetails = (0, rank_1.default)(entry.p);
                    if (index === 0) {
                        /* top 1 */ return `:crown: ( ${entry.p} ) <@${entry.userId}>`;
                    }
                    else if (index === 1) {
                        /* top 2 */ return `<:silvermedal3:1309923637846872094> ( ${entry.p} ) <@${entry.userId}>`;
                    }
                    else if (index === 2) {
                        /* top 3 */ return `<:bronzemedal:1309923618322513922> ( ${entry.p} ) <@${entry.userId}>`;
                    }
                    else {
                        return `#${index + 1} ( ${entry.p} ) <@${entry.userId}>`;
                    }
                })
                    .slice(0, 10)
                    .join("\n");
                const emb = (0, mainEmbed_1.default)(top10PointsAll, "لاتسى قول ( ما شاء الله )", "لاتسى قول ( ما شاء الله )");
                yield interaction.editReply({
                    embeds: [emb],
                });
            }
        });
    }
}
exports.default = CommandHandler;
