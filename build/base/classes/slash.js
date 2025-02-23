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
const colors_1 = __importDefault(require("colors"));
class slash {
    load(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = client.devlopmentMode ? client.config.devclientId : client.config.clientId;
            const guildId = client.devlopmentMode ? client.config.devguildId : client.config.guildId;
            const token = client.devlopmentMode ? client.config.devtoken : client.config.token;
            const commands = this.GetJson(client.commands);
            const rest = new discord_js_1.REST().setToken(token);
            const setCommands = yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            });
            console.log(colors_1.default.underline("[REST API] ").green + `Successfully set ${setCommands.length} commands!`);
        });
    }
    GetJson(commands) {
        const data = [];
        commands.forEach(command => {
            data.push({
                name: command.data.name,
                command: command
            });
        });
        return data;
    }
}
exports.default = slash;
