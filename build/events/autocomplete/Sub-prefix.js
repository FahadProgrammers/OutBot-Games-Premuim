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
const Events_1 = __importDefault(require("../../base/classes/Events"));
const SchemaPrefix_1 = __importDefault(require("../../schema/SchemaPrefix"));
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
            if (!interaction.isAutocomplete())
                return;
            if (interaction.commandName === "prefix") {
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return;
                }
                const focusedValue = interaction.options.getFocused(true);
                if (focusedValue.name === "delprefix") {
                    const schema_1 = (yield SchemaPrefix_1.default.find({
                        guildId: interaction.guild.id,
                    })) || null;
                    if (!schema_1) {
                        yield interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
                        return;
                    }
                    const responses = schema_1
                        .map((data, index) => {
                        if (typeof data.channelId === "string") {
                            const channel = this.client.channels.cache.get(data === null || data === void 0 ? void 0 : data.channelId);
                            if (channel instanceof discord_js_1.TextChannel) {
                                return {
                                    name: `البريفكس: [${data.prefix.join(",") || "Unknown"}]\ القناه: #${channel.name}`,
                                    value: `${data.prefix || "Unknown"}_${data.channelId}`,
                                };
                            }
                            return null;
                        }
                    })
                        .filter(Boolean);
                    if (responses.length > 0) {
                        const validSelectNames = responses.filter((role) => role !== null);
                        yield interaction.respond(validSelectNames);
                    }
                    else {
                        yield interaction.respond([
                            { name: "لا توجد بادئات صالحة 🙄", value: "" },
                        ]);
                    }
                }
            }
        });
    }
}
exports.default = CommandHandler;
