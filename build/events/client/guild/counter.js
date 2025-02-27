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
const SchemaCounter_1 = __importDefault(require("../../../schema/SchemaCounter"));
class MessageCommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.MessageCreate,
            description: "MessageCreate Counter",
            once: false,
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!message.content || typeof message.content !== "string" || !message.guild) {
                return;
            }
            try {
                const channelData = yield SchemaCounter_1.default.findOne({ guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id, channelId: message.channel.id });
                if (!channelData)
                    return;
                const count = channelData.count;
                if (parseInt(message.content) === count + 1) {
                    yield SchemaCounter_1.default.updateOne({ guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id, channelId: message.channel.id }, { count: count + 1 });
                }
                else {
                    if (message.author.id === ((_c = this.client.user) === null || _c === void 0 ? void 0 : _c.id)) {
                        return;
                    }
                    if (channelData.roleId) {
                        const user = yield ((_d = this.client.guilds.cache.get(message.guild.id)) === null || _d === void 0 ? void 0 : _d.members.cache.get(message.author.id));
                        if (user) {
                            if (user.roles.cache.some(r => r.id === channelData.roleId)) {
                                return;
                            }
                        }
                    }
                    ;
                    yield message.delete().catch(() => { });
                }
            }
            catch (err) {
                console.log("err help sos", err);
                message.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`❌ قد واجتنها مشكله: ${err.message}`),
                    ],
                });
            }
        });
    }
}
exports.default = MessageCommandHandler;
