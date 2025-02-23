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
const SchemaPrefix_1 = __importDefault(require("../../../schema/SchemaPrefix"));
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
            var _a, _b;
            if (!interaction.isButton())
                return;
            if (interaction.customId === `more_${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id}`) {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const prefixFind = yield SchemaPrefix_1.default.findOne({
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                });
                const emb = (0, mainEmbed_1.default)(`${(prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix.length) === 1 ? "بادئة" : "بادئات"} البوت : **${(prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix.join(",")) || "+"}**`, "System", "System");
                yield interaction.editReply({
                    embeds: [emb],
                });
            }
        });
    }
}
exports.default = CommandHandler;
