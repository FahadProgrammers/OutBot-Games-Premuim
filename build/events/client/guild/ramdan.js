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
const SchemaPrefix_1 = __importDefault(require("../../../schema/SchemaPrefix"));
const RamdanXP_1 = __importDefault(require("../../../schema/RamdanXP"));
const SchemaUsers_1 = __importDefault(require("../../../schema/SchemaUsers"));
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
            var _a, _b, _c, _d;
            if (!interaction.isButton())
                return;
            if (interaction.customId === `ramdan`) {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const prefixFind = yield SchemaPrefix_1.default.findOne({
                    guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
                    channelId: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id,
                });
                if (!interaction.guild) {
                    return console.log("خطا في interaction.guild");
                }
                const emb = new discord_js_1.EmbedBuilder()
                    .setDescription(`🫡 | **تحيه لك**، خذ **دبل نقاط** لين حوالي نهاية رمضان مع **50** نقطه, جزاك الله خيرا.`)
                    .setColor("Red");
                if (emb) {
                    const f = yield RamdanXP_1.default.findOne({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id
                    });
                    if (f) {
                        yield interaction.editReply({
                            content: ":eyes: | كشفتك!"
                        });
                    }
                    else {
                        new RamdanXP_1.default({
                            guildId: interaction.guild.id,
                            userId: interaction.user.id
                        }).save();
                        const f2 = yield SchemaUsers_1.default.findOne({
                            guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                            userId: interaction.user.id
                        });
                        if (f2) {
                            f2.p += 50;
                            yield f2.save();
                        }
                        else {
                            new SchemaUsers_1.default({
                                guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                                userId: interaction.user.id,
                                p: 50
                            }).save();
                        }
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
            }
        });
    }
}
exports.default = CommandHandler;
