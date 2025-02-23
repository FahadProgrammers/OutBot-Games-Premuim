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
const SchemaChannel_1 = __importDefault(require("../../schema/SchemaChannel"));
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
            if (interaction.commandName === "command") {
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return;
                }
                const focusedValue = interaction.options.getFocused(true);
                if (focusedValue.name === "channel") {
                    const schema_1 = yield SchemaChannel_1.default.findOne({
                        guildId: interaction.guild.id,
                    });
                    const channels = (schema_1 === null || schema_1 === void 0 ? void 0 : schema_1.channelId) || [];
                    const filtered = channels.filter((channelId) => channelId.toLowerCase().startsWith(focusedValue.value.toLowerCase()));
                    const channelNames = yield Promise.all(filtered.map((channelId) => __awaiter(this, void 0, void 0, function* () {
                        const channel = this.client.channels.cache.get(channelId);
                        if (channel instanceof discord_js_1.TextChannel) {
                            return { name: "#" + channel.name, value: channelId };
                        }
                        return null;
                    })));
                    if (filtered.length === 0) {
                        yield interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
                        return;
                    }
                    const validChannelNames = channelNames.filter((channel) => channel !== null);
                    yield interaction.respond(validChannelNames);
                }
            }
        });
    }
}
exports.default = CommandHandler;
