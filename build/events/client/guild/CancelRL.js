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
const SchemaRoulette_1 = __importDefault(require("../../../schema/Roulette/SchemaRoulette"));
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
            if (interaction.customId.startsWith(`rremove_${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id}_`)) {
                const [, gid, msgid] = interaction.customId.split("_");
                console.log(msgid);
                if (!((_b = interaction.memberPermissions) === null || _b === void 0 ? void 0 : _b.has("ManageGuild"))) {
                    yield interaction.reply({
                        content: `${emojis_1.default.false} | ليس لديك الصلاحيات الكافيه لإلغاء اللعبه!`,
                    });
                    return;
                }
                const findGame = yield SchemaRoulette_1.default.findOne({
                    guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                    channelId: (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.id,
                    msgId: msgid,
                });
                if (!findGame) {
                    yield interaction.reply({
                        content: `${emojis_1.default.false} | اللعبه غير متوفره للإلغاء!`,
                        ephemeral: true
                    });
                    return;
                }
                if (!interaction.replied && !interaction.deferred) {
                    yield interaction.reply({
                        content: `${emojis_1.default.true} | تم إلغاء اللعبه بنجاح!`,
                        ephemeral: true
                    });
                    yield findGame.deleteOne();
                }
                const components = interaction.message.components.map((row) => {
                    const actionRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((component) => {
                        var _a, _b, _c, _d, _e;
                        if (component.type === discord_js_1.ComponentType.Button) {
                            const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                            if (!buttonData.label && !component.data.emoji) {
                                buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                            }
                            actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                        }
                    });
                    return actionRow;
                });
                interaction.message.edit({
                    components: components.map((row) => row.toJSON()),
                });
            }
        });
    }
}
exports.default = CommandHandler;
