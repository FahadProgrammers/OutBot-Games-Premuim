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
const BaseEmbed_1 = __importDefault(require("../../../utils/embeds/BaseEmbed"));
const SchemaPrefix_1 = __importDefault(require("../../../schema/SchemaPrefix"));
const emojis_1 = __importDefault(require("../../../utils/functions/emojis"));
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
            var _a, _b, _c;
            if (!interaction.isButton())
                return;
            if (interaction.customId === `more_${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id}`) {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const prefixFind = yield SchemaPrefix_1.default.findOne({
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                    channelId: (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.id,
                });
                if (!interaction.guild) {
                    return console.log("خطا في interaction.guild");
                }
                const emb = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    title: `${(prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix.length) === 1 ? "بادئة" : "بادئات"} **البوت**`,
                    des: `
          <:blogging:1343040598919090236> **البريفكس** المخصصه لديك في هاذي القناه **هيَ**:
${emojis_1.default.open} **${(prefixFind === null || prefixFind === void 0 ? void 0 : prefixFind.prefix.join(",")) || "+"}** ${emojis_1.default.close}
          `,
                    line: false,
                    footer: "بيانات القناه",
                    fields: "بيانات القناه"
                }, "Base");
                if (emb) {
                    yield interaction.editReply({
                        embeds: [emb],
                    });
                }
            }
        });
    }
}
exports.default = CommandHandler;
