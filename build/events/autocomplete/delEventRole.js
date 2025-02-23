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
const SchemaEvent_1 = __importDefault(require("../../schema/SchemaEvent"));
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
            if (!interaction.isAutocomplete())
                return;
            if (interaction.commandName === "command") {
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return;
                }
                const focusedValue = interaction.options.getFocused(true);
                const commands = this.client.messagecommands;
                if (focusedValue.name === "command") {
                    const commandsWithFound1 = yield SchemaEvent_1.default.find({
                        guildId: interaction.guild.id,
                        channelId: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id,
                    });
                    if (!commandsWithFound1) {
                        yield interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
                        return;
                    }
                }
                else if (focusedValue.name === "select") {
                    const commandsWithFound1 = yield SchemaEvent_1.default.find({
                        guildId: interaction.guild.id,
                    });
                    if (!commandsWithFound1) {
                        yield interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
                        return;
                    }
                    const channelNames = yield Promise.all(commandsWithFound1.map((data) => __awaiter(this, void 0, void 0, function* () {
                        const channel = this.client.channels.cache.get(data.channelId);
                        if (channel instanceof discord_js_1.TextChannel) {
                            return { name: "#" + channel.name, value: data.channelId };
                        }
                        return null;
                    })));
                    const validChannelNames = channelNames.filter((channel) => channel !== null);
                    const roleNames = yield Promise.all(commandsWithFound1.map((data) => __awaiter(this, void 0, void 0, function* () {
                        const guild = yield this.client.guilds.cache.get(data.guildId);
                        const role = yield (guild === null || guild === void 0 ? void 0 : guild.roles.cache.get(data.roleId));
                        if (role instanceof discord_js_1.Role) {
                            return { name: role.name, value: role.id };
                        }
                        return null;
                    })));
                    const validRoleNames = roleNames.filter((role) => role !== null);
                    const commandsWithFound = commandsWithFound1.map((data) => ({
                        name: data.command,
                        value: data.command,
                    }));
                    const respond = yield Promise.all(commandsWithFound1.map((data) => __awaiter(this, void 0, void 0, function* () {
                        const guild = yield this.client.guilds.cache.get(data.guildId);
                        const channel = yield this.client.channels.cache.get(data.channelId);
                        const role = yield (guild === null || guild === void 0 ? void 0 : guild.roles.cache.get(data.roleId));
                        const command = data.command;
                        if (channel instanceof discord_js_1.TextChannel) {
                            return {
                                name: `#${channel.name}, ${role === null || role === void 0 ? void 0 : role.name}, ${command}`,
                                value: `${channel.id}_${role === null || role === void 0 ? void 0 : role.id}_${command}`,
                            };
                        }
                    })));
                    const validSelectNames = respond.filter((role) => role !== null);
                    yield interaction.respond(validSelectNames);
                }
            }
        });
    }
}
exports.default = CommandHandler;
