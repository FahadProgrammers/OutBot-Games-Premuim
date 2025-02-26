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
const emojis_1 = __importDefault(require("../../../utils/functions/emojis"));
const SchemaPremuim_1 = __importDefault(require("../../../schema/SchemaPremuim"));
const BaseEmbed_1 = __importDefault(require("../../../utils/embeds/BaseEmbed"));
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
            if (interaction.customId.startsWith("changeserver-premuim")) {
                yield interaction.deferReply({
                    ephemeral: true
                });
                const dataUserFindOne = yield SchemaPremuim_1.default.findOne({
                    owner: (_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id
                });
                if (!dataUserFindOne) {
                    yield interaction.editReply({
                        content: `لم اجدك في قاعدة البيانات! | ${emojis_1.default.false}`
                    });
                    return;
                }
                const dataUserFind = yield SchemaPremuim_1.default.find({
                    owner: (_b = interaction.user) === null || _b === void 0 ? void 0 : _b.id
                });
                const UserData = dataUserFind.map((data) => {
                    var _a;
                    return ({
                        label: `${(_a = this.client.guilds.cache.get(data.guildId)) === null || _a === void 0 ? void 0 : _a.name} | ${data.guildId}`,
                        value: `guild_${data.guildId}`,
                    });
                });
                if (!interaction.guild)
                    return;
                const base = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                    line: false,
                    title: "يرجى اختيار البوت المناسب أدناه",
                    footer: "نظام البريميوم",
                    fields: "اختر السيرفر لتعديله",
                }, "Base");
                const select = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("premuimsystem-editserver")
                    .addOptions(UserData));
                if (base) {
                    yield interaction.editReply({
                        embeds: [base],
                        components: [select],
                    });
                }
            }
            else if (interaction.customId.startsWith("guild_")) {
                const [, guildId] = interaction.customId.split("_");
            }
        });
    }
}
exports.default = CommandHandler;
;
