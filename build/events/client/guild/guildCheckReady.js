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
const SchemaPremuim_1 = __importDefault(require("../../../schema/SchemaPremuim"));
class GuildCheckCommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.ClientReady,
            description: "Command GuildCheck",
            once: false,
        });
    }
    execute(client) {
        return __awaiter(this, void 0, void 0, function* () {
            client.guilds.cache.forEach((guild) => __awaiter(this, void 0, void 0, function* () {
                const find = yield SchemaPremuim_1.default.findOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                });
                if (find) {
                    if (guild.id !== find.guildId) {
                        yield guild.leave();
                    }
                }
                else {
                    if (guild.id !== process.env.guildId) {
                        yield guild.leave();
                    }
                }
            }));
        });
    }
}
exports.default = GuildCheckCommandHandler;
