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
            try {
                if (!interaction.isChatInputCommand())
                    return;
                const command = this.client.commands.get(interaction.commandName);
                //@ts-ignore
                if (!command.data.name)
                    return ((yield interaction.reply({
                        content: "This command does not exist!",
                        ephemeral: true,
                    })) && this.client.commands.delete(interaction.commandName));
                const { colldowns } = this.client;
                if (!colldowns.has(command.data.name)) {
                    colldowns.set(command.data.name, new discord_js_1.Collection());
                }
                const now = Date.now();
                const timestamps = colldowns.get(command.data.name);
                const colldownAmount = (command.cooldown || 3) * 1000;
                if (timestamps.has(interaction.user.id) &&
                    now < timestamps.get(interaction.user.id) + colldownAmount)
                    return interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`❌ Please wait another \`${((timestamps.get(interaction.user.id) +
                                colldownAmount -
                                now) /
                                1000).toFixed(1)} \` seconds to run command`),
                        ],
                        ephemeral: true,
                    });
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), colldownAmount);
                return command.execute(interaction);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = CommandHandler;
