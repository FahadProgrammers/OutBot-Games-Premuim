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
const moment_1 = __importDefault(require("moment"));
class PremuimHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.ClientReady,
            description: "Command Handler Event",
            once: false,
        });
    }
    execute(client) {
        return __awaiter(this, void 0, void 0, function* () {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                let find = yield SchemaPremuim_1.default.find();
                if (!find)
                    return;
                for (let entry of find) {
                    if ((0, moment_1.default)().isAfter((0, moment_1.default)(entry.time))) {
                        try {
                            const guild = yield client.guilds.cache.get(entry === null || entry === void 0 ? void 0 : entry.guildId);
                            guild === null || guild === void 0 ? void 0 : guild.leave();
                            const user = yield client.users.cache.get(entry === null || entry === void 0 ? void 0 : entry.owner);
                            const channel = yield client.channels.cache.get("1306088477875507270");
                            user === null || user === void 0 ? void 0 : user.send({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setDescription(`<:Arrow1:1299711671052402718>  إنتهاء الاشتراك

لقد انتهى اشتراكك نتمنى لك وقت استمتعت فيه بالبوت وشكرا ل دعمنا!
`)
                                        .setTimestamp()
                                        .setFooter({
                                        text: `${guild === null || guild === void 0 ? void 0 : guild.name} - System`,
                                        iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined,
                                    })
                                        .setColor("Red")
                                        .setAuthor({
                                        name: `${guild === null || guild === void 0 ? void 0 : guild.name} - System`,
                                        iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined,
                                    }),
                                ],
                            });
                            if (channel instanceof discord_js_1.TextChannel) {
                                channel === null || channel === void 0 ? void 0 : channel.send({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setDescription(`<:Arrow1:1299711671052402718>  إنتهاء الاشتراك

### معلومات المستخدم

ايدي المالك : \`${entry === null || entry === void 0 ? void 0 : entry.owner}\`
اشترك منذ ( ممكن تقريبا ): <t:${Math.floor(entry.starttime.getTime() / 1000)}:R>
انتهى منذ ( ممكن تقريبا ):<t:${Math.floor(entry.time.getTime() / 1000)}:R>
`)
                                            .setTimestamp()
                                            .setFooter({
                                            text: `${guild === null || guild === void 0 ? void 0 : guild.name} - System`,
                                            iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined,
                                        })
                                            .setColor("Red")
                                            .setAuthor({
                                            name: `${guild === null || guild === void 0 ? void 0 : guild.name} - System`,
                                            iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined,
                                        }),
                                    ],
                                });
                                yield SchemaPremuim_1.default.deleteOne({
                                    guildId: entry.guildId,
                                    time: entry.time,
                                    starttime: entry.starttime,
                                    owner: entry.owner,
                                    token: entry.token,
                                });
                            }
                        }
                        catch (error) {
                            return console.log(error);
                        }
                    }
                }
            }), 60000);
        });
    }
}
exports.default = PremuimHandler;
