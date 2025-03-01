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
const wheel_1 = require("../../../utils/roulette/wheel");
const SchemaRoulette_1 = __importDefault(require("../../../schema/Roulette/SchemaRoulette"));
const SchemaRoulettePoints_1 = __importDefault(require("../../../schema/Roulette/SchemaRoulettePoints"));
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            if (!interaction.isButton())
                return;
            if (interaction.customId.startsWith("roulette_")) {
                const [, action, playerId, guildId, id, playerNum] = interaction.customId.split("_");
                if (action === "kick") {
                    //Fetch Main Message To id
                    if (interaction.user.id !== playerId) {
                        yield interaction.reply({
                            content: `شلون يعني؟`,
                            ephemeral: true,
                        });
                    }
                    const message = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(id));
                    const findRoulette = yield SchemaRoulette_1.default.findOne({
                        guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                        channelId: (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.id,
                        msgId: id,
                    });
                    //Find User
                    const findUser = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.userId === playerId);
                    if (findRoulette && findUser) {
                        if (!interaction.replied && !interaction.deferred) {
                            yield interaction.reply({
                                content: `${emojis_1.default.true} | تم بنجاح`,
                                ephemeral: true,
                            });
                        }
                        if (findUser.security) {
                            if (interaction.channel instanceof discord_js_1.TextChannel) {
                                yield interaction.channel.send({
                                    content: `<:security1:1329156583992590456> تم حمايته من قبل الحارس الشخصي!`,
                                });
                                if (message) {
                                    const components = interaction.message.components.map((row) => {
                                        const actionRow = new discord_js_1.ActionRowBuilder();
                                        row.components.forEach((component) => {
                                            var _a, _b, _c, _d, _e;
                                            if (component.type === discord_js_1.ComponentType.Button) {
                                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                                                if (!buttonData.label && !component.data.emoji) {
                                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                                }
                                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                                            }
                                        });
                                        return actionRow;
                                    });
                                    yield interaction.message.edit({
                                        components: components.map((row) => row.toJSON()),
                                    });
                                    // تحديث بيانات اللاعب
                                    findUser.security = false;
                                    findUser.securityUsed = false;
                                    yield findRoulette.save();
                                    // بدء لعبة الروليت مرة أخرى
                                    yield (0, wheel_1.startRouletteGame)(message, findRoulette.players, this.client, id);
                                }
                            }
                        }
                    }
                    const components = interaction.message.components.map((row) => {
                        const actionRow = new discord_js_1.ActionRowBuilder();
                        row.components.forEach((component) => {
                            var _a, _b, _c, _d, _e;
                            if (component.type === discord_js_1.ComponentType.Button) {
                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                                if (!buttonData.label && !component.data.emoji) {
                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                }
                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                            }
                        });
                        return actionRow;
                    });
                    yield interaction.message.edit({
                        components: components.map((row) => row.toJSON()),
                    });
                    // الرد النهائي فقط إذا لم يكن قد تم الرد مسبقًا
                    if (interaction.channel instanceof discord_js_1.TextChannel) {
                        yield ((_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.send({
                            content: `<:emoji_29:1327724572635697345> | لقد تم **طرد** <@${playerId}> 
         من **قبل**: <@${(_e = interaction.user) === null || _e === void 0 ? void 0 : _e.id}>`,
                        }));
                    }
                    const find = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.number === Number(playerNum));
                    if (find && findRoulette) {
                        findRoulette.players = findRoulette.players.filter((x) => x.number != Number(playerNum));
                        yield findRoulette.save();
                    }
                    if (!findRoulette)
                        return;
                    if (!message)
                        return;
                    yield (0, wheel_1.startRouletteGame)(message, findRoulette.players, this.client, id);
                }
                else if (action === "secruity") {
                    const findPointsRoulette = yield SchemaRoulettePoints_1.default.findOne({
                        guildId: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id,
                        userId: (_g = interaction.user) === null || _g === void 0 ? void 0 : _g.id,
                    });
                    if (!findPointsRoulette || (findPointsRoulette === null || findPointsRoulette === void 0 ? void 0 : findPointsRoulette.p) < 100) {
                        yield interaction.reply({
                            content: `ليس لديك النقاط الكافية لتفعيل الحارس الشخصي تحتاج الى: \`${findPointsRoulette ? findPointsRoulette.p - 100 : "لاتملك"}\``,
                            ephemeral: true,
                        });
                        return;
                    }
                    const message = yield ((_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.messages.fetch(id));
                    const findRoulette = yield SchemaRoulette_1.default.findOne({
                        guildId: (_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.id,
                        channelId: (_k = interaction.channel) === null || _k === void 0 ? void 0 : _k.id,
                        msgId: id,
                    });
                    const findUser = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.userId === playerId);
                    const components = interaction.message.components.map((row) => {
                        const actionRow = new discord_js_1.ActionRowBuilder();
                        row.components.forEach((component) => {
                            var _a, _b, _c, _d, _e;
                            if (component.type === discord_js_1.ComponentType.Button) {
                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" } });
                                if (!buttonData.label && !component.data.emoji) {
                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                }
                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                            }
                        });
                        return actionRow;
                    });
                    if (components.length > 0 &&
                        components[0].components[0].data.type === discord_js_1.ComponentType.Button &&
                        components[0].components[2].data.type === discord_js_1.ComponentType.Button) {
                        if ((findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.dobuleUsed) === true) {
                            components[0].components[1].setDisabled(true);
                        }
                        components[0].components[0].setDisabled(true);
                        components[0].components[2].setDisabled(true);
                        yield interaction.update({
                            components: components.map((row) => row.toJSON()),
                        });
                    }
                }
                else if (action === "cancel") {
                    const findPointsRoulette = yield SchemaRoulettePoints_1.default.findOne({
                        guildId: (_l = interaction.guild) === null || _l === void 0 ? void 0 : _l.id,
                        userId: (_m = interaction.user) === null || _m === void 0 ? void 0 : _m.id,
                    });
                    if (!findPointsRoulette || (findPointsRoulette === null || findPointsRoulette === void 0 ? void 0 : findPointsRoulette.p) < 150) {
                        yield interaction.reply({
                            content: `ليس لديك النقاط الكافية لتفعيل الغاء روليت تحتاج الى: \`${findPointsRoulette ? findPointsRoulette.p - 150 : "لاتملك"}\``,
                            ephemeral: true,
                        });
                        return;
                    }
                    const findRoulette = yield SchemaRoulette_1.default.findOne({
                        guildId: (_o = interaction.guild) === null || _o === void 0 ? void 0 : _o.id,
                        channelId: (_p = interaction.channel) === null || _p === void 0 ? void 0 : _p.id,
                        msgId: id,
                    });
                    const findUser = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.userId === playerId);
                    if (findRoulette && findUser) {
                        findUser.cancel = true;
                        findUser.cancelUsed = true;
                        yield findRoulette.save();
                    }
                    const components = interaction.message.components.map((row) => {
                        const actionRow = new discord_js_1.ActionRowBuilder();
                        row.components.forEach((component) => {
                            var _a, _b, _c, _d, _e;
                            if (component.type === discord_js_1.ComponentType.Button) {
                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                                if (!buttonData.label && !component.data.emoji) {
                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                }
                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                            }
                        });
                        return actionRow;
                    });
                    yield interaction.update({
                        components: components.map((row) => row.toJSON()),
                    });
                    if (interaction.channel instanceof discord_js_1.TextChannel) {
                        interaction.channel.send({
                            content: `<:emoji_24:1327724457732603945> | تم الغاء جولة الروليت, من هو الفاعل ياترى؟ 🤔`,
                        });
                    }
                }
                else if (action === "withdraw") {
                    const message = yield ((_q = interaction.channel) === null || _q === void 0 ? void 0 : _q.messages.fetch(id));
                    const findRoulette = yield SchemaRoulette_1.default.findOne({
                        guildId: (_r = interaction.guild) === null || _r === void 0 ? void 0 : _r.id,
                        channelId: (_s = interaction.channel) === null || _s === void 0 ? void 0 : _s.id,
                        msgId: id,
                    });
                    const findUser = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.userId === playerId);
                    const components = interaction.message.components.map((row) => {
                        const actionRow = new discord_js_1.ActionRowBuilder();
                        row.components.forEach((component) => {
                            var _a, _b, _c, _d, _e;
                            if (component.type === discord_js_1.ComponentType.Button) {
                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                                if (!buttonData.label && !component.data.emoji) {
                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                }
                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                            }
                        });
                        return actionRow;
                    });
                    yield interaction.update({
                        components: components.map((row) => row.toJSON()),
                    });
                    const find = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => { var _a; return p.userId === ((_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id); });
                    if (find && findRoulette) {
                        findRoulette.players = findRoulette.players.filter((x) => x.userId != interaction.user.id);
                        yield findRoulette.save();
                        if (interaction.channel instanceof discord_js_1.TextChannel) {
                            yield interaction.channel.send({
                                content: `<:emoji_30:1327724585562407024> | لقد انسحب من اللعبه!`,
                            });
                        }
                    }
                }
                else if (action === "dobule") {
                    const findPointsRoulette = yield SchemaRoulettePoints_1.default.findOne({
                        guildId: (_t = interaction.guild) === null || _t === void 0 ? void 0 : _t.id,
                        userId: (_u = interaction.user) === null || _u === void 0 ? void 0 : _u.id,
                    });
                    if (!findPointsRoulette || (findPointsRoulette === null || findPointsRoulette === void 0 ? void 0 : findPointsRoulette.p) < 50) {
                        yield interaction.reply({
                            content: `ليس لديك النقاط الكافية لتفعيل دبل نقاط روليت تحتاج الى: \`${findPointsRoulette ? findPointsRoulette.p - 50 : "لاتملك"}\``,
                            ephemeral: true,
                        });
                        return;
                    }
                    const message = yield ((_v = interaction.channel) === null || _v === void 0 ? void 0 : _v.messages.fetch(id));
                    const findRoulette = yield SchemaRoulette_1.default.findOne({
                        guildId: (_w = interaction.guild) === null || _w === void 0 ? void 0 : _w.id,
                        channelId: (_x = interaction.channel) === null || _x === void 0 ? void 0 : _x.id,
                        msgId: id,
                    });
                    const findUser = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.userId === playerId);
                    const components = interaction.message.components.map((row) => {
                        const actionRow = new discord_js_1.ActionRowBuilder();
                        row.components.forEach((component) => {
                            var _a, _b, _c, _d, _e;
                            if (component.type === discord_js_1.ComponentType.Button) {
                                const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${interaction.user.id}_${playerNum}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" } });
                                if (!buttonData.label && !component.data.emoji) {
                                    buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                                }
                                actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                            }
                        });
                        return actionRow;
                    });
                    if (components.length > 0 &&
                        components[0].components[1].data.type === discord_js_1.ComponentType.Button &&
                        components[0].components[2].data.type === discord_js_1.ComponentType.Button) {
                        if ((findUser === null || findUser === void 0 ? void 0 : findUser.securityUsed) === true) {
                            components[0].components[0].setDisabled(true);
                        }
                        components[0].components[1].setDisabled(true);
                        components[0].components[2].setDisabled(true);
                        yield interaction.update({
                            components: components.map((row) => row.toJSON()),
                        });
                    }
                    const find = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => { var _a; return p.userId === ((_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id); });
                    if (find && findRoulette) {
                        findRoulette.dobule = true;
                        findRoulette.dobuleUsed = true;
                        yield findRoulette.save();
                        if (interaction.channel instanceof discord_js_1.TextChannel) {
                            yield interaction.channel.send({
                                content: `<:star:1328433221536583831> | تم تفعيل دبل نقاط في لعبة روليت, من قبل: <@${(_y = interaction.user) === null || _y === void 0 ? void 0 : _y.id}>`,
                            });
                        }
                    }
                }
            }
        });
    }
}
exports.default = CommandHandler;
