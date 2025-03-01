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
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const SchemaRoulette_1 = __importDefault(require("../../schema/Roulette/SchemaRoulette"));
const wheel_1 = require("../../utils/roulette/wheel");
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const SchemaRoulettePoints_1 = __importDefault(require("../../schema/Roulette/SchemaRoulettePoints"));
const SchemaCommandControl_1 = __importDefault(require("../../schema/SchemaCommandControl"));
class Roulette extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "روليت",
            description: "لعبه روليت",
            category: Category_1.default.مجموعه,
            cooldown: 3,
            aliases: ["roulette", "رول"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            try {
                const f = yield SchemaCommandControl_1.default.findOne({
                    guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                });
                if (!f) {
                    if (!((_b = message.member) === null || _b === void 0 ? void 0 : _b.permissions.has("ManageGuild"))) {
                        return yield message.reply({
                            content: `${emojis_1.default.false} | لاتملك صلاحيه **ManageGuild** لتشغيل الأمر`
                        });
                    }
                }
                //Types
                let roulette_status = true;
                const idMap = new Map();
                //Game in TimeStamp ( not used)
                // const timestart = `**<t:${Math.floor(
                //   (Date.now() + 15 /* 15 Seconds */ * 1000) / 1000
                // )}:R>**`;
                //Find Game To DataBase
                const findGame = yield SchemaRoulette_1.default.findOne({
                    guildId: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.id,
                    channelId: message.channel.id,
                });
                let msgRemoveRoulette;
                if (findGame) {
                    const ButtonRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setStyle(discord_js_1.ButtonStyle.Secondary)
                        .setLabel(`إلغاء اللعبه المتوفره`)
                        .setCustomId(`rremove_${(_d = message.guild) === null || _d === void 0 ? void 0 : _d.id}_${findGame.msgId}`)
                        .setEmoji("<:emoji_24:1327724457732603945>"));
                    msgRemoveRoulette = yield message.reply({
                        content: `${emojis_1.default.false} | لايمكن تشغيل اكثر من لعبه روليت بنفس الروم!`,
                        components: [ButtonRow],
                    });
                    return;
                }
                //Embed Game
                const embd = new discord_js_1.EmbedBuilder()
                    .addFields([
                    {
                        name: "__طريقة اللعب:__ <:theory:1328358024527478844>",
                        value: `
      **1**. انضم في اللعبه من خلال الزر ( <:emoji_26:1327724484815228948> )
            **2**. ستبدأ الجولة الأولى وسيتم تدوير العجلة واختيار لاعب عشوائي
            **3**. إذا كنت اللاعب المختار ، فستختار لاعبًا من اختيارك ليتم طرده من اللعبة`,
                    },
                    {
                        name: `__الاعبين__ <:emoji_24:1327724457732603945>`,
                        value: "لايوجد",
                    },
                ])
                    .setTimestamp()
                    .setFooter({
                    text: `OutBot Games - "Game"`,
                    iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&",
                })
                    .setColor("Red")
                    .setAuthor({
                    name: `OutBot Games - "Game"`,
                    iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&",
                });
                const actionRows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("joingame")
                    .setEmoji(emojis_1.default.roulette.join_game)
                    .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
                    .setCustomId("leavegame")
                    .setEmoji(emojis_1.default.roulette.leave_game)
                    .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
                    .setCustomId("shopgame")
                    .setEmoji(emojis_1.default.roulette.shop)
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("timedisabled")
                    .setEmoji(emojis_1.default.roulette.time)
                    .setLabel("15")
                    .setDisabled(true)
                    .setStyle(discord_js_1.ButtonStyle.Primary));
                if (message.channel instanceof discord_js_1.TextChannel) {
                    let time = 15;
                    const msg = yield message.channel.send({
                        embeds: [embd],
                        components: [actionRows],
                    });
                    const interval = setInterval(function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            const editedComponents = new discord_js_1.ActionRowBuilder().addComponents(actionRows.components[0], actionRows.components[1], actionRows.components[2], actionRows.components[3].setLabel(time.toString()));
                            yield msg.edit({ components: [editedComponents] });
                            time -= 1;
                            if (time < 0) {
                                clearInterval(interval);
                            }
                        });
                    }, 1000);
                    let findGameMsg = yield SchemaRoulette_1.default.findOne({
                        guildId: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id,
                        channelId: message.channel.id,
                        msgId: msg.id,
                    });
                    if (!findGameMsg) {
                        yield new SchemaRoulette_1.default({
                            guildId: (_f = message.guild) === null || _f === void 0 ? void 0 : _f.id,
                            channelId: message.channel.id,
                            players: [],
                            msgId: msg.id,
                        }).save();
                    }
                    //Local DataBase
                    idMap.set(`${(_g = message.guild) === null || _g === void 0 ? void 0 : _g.id}-${message.channel.id}-${msg.id}`, {
                        guildId: (_j = (_h = message.guild) === null || _h === void 0 ? void 0 : _h.id) !== null && _j !== void 0 ? _j : "",
                        channelId: message.channel.id,
                        number: 0,
                        msgId: msg.id,
                    });
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        //Disabled Buttons
                        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(actionRows.components[0].setDisabled(true), actionRows.components[1].setDisabled(true), actionRows.components[2].setDisabled(true), actionRows.components[3]);
                        yield msg.edit({ components: [disabledRow] });
                        if (roulette_status === false)
                            return;
                        findGameMsg = yield SchemaRoulette_1.default.findOne({
                            guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                            channelId: message.channel.id,
                            msgId: msg.id,
                        });
                        if (findGameMsg) {
                            if ((findGameMsg === null || findGameMsg === void 0 ? void 0 : findGameMsg.players.length) < 3) {
                                yield message.reply({
                                    content: `${emojis_1.default.false} | لايمكن تشغيل اللعبه يلزم تواجد **3** على الاقل!`,
                                });
                                yield (findGameMsg === null || findGameMsg === void 0 ? void 0 : findGameMsg.deleteOne({
                                    guildId: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
                                    channelId: message.channel.id,
                                    msgId: msg.id,
                                }));
                                return;
                            }
                            findGameMsg = yield SchemaRoulette_1.default.findOne({
                                guildId: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.id,
                                channelId: message.channel.id,
                                msgId: msg.id,
                            });
                            yield (0, wheel_1.startRouletteGame)(message, findGameMsg === null || findGameMsg === void 0 ? void 0 : findGameMsg.players, this.client, msg.id);
                        }
                    }), 15000);
                    this.client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                        if (!interaction.isButton())
                            return;
                        const username = interaction.user.username;
                        const key = `${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}-${message.channel.id}-${msg.id}`;
                        const data = idMap.get(key);
                        if (interaction.customId.startsWith(`rremove_${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id}_`)) {
                            const [, gid, msgid] = interaction.customId.split("_");
                            console.log(msgid);
                            if (!((_c = interaction.memberPermissions) === null || _c === void 0 ? void 0 : _c.has("ManageEvents"))) {
                                yield interaction.reply({
                                    content: `${emojis_1.default.false} | ليس لديك الصلاحيات الكافيه لإلغاء اللعبه!`,
                                });
                                return;
                            }
                            const findGame = yield SchemaRoulette_1.default.findOne({
                                guildId: (_d = message.guild) === null || _d === void 0 ? void 0 : _d.id,
                                channelId: message.channel.id,
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
                            yield findGame.deleteOne({
                                guildId: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id,
                                channelId: message.channel.id,
                                msgId: msg.id,
                            });
                            roulette_status = false;
                        }
                        if (interaction.customId === "shopgame") {
                            let disableS = false;
                            let disableDobule = false;
                            const findRoulette = yield SchemaRoulette_1.default.findOne({
                                guildId: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id,
                                channelId: (_g = interaction.channel) === null || _g === void 0 ? void 0 : _g.id,
                                msgId: data === null || data === void 0 ? void 0 : data.msgId,
                            });
                            const find = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => { var _a; return p.userId === ((_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id); });
                            if ((find === null || find === void 0 ? void 0 : find.securityUsed) === true) {
                                disableS = true;
                            }
                            if ((findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.dobuleUsed) === true) {
                                disableDobule = true;
                            }
                            const findPoints = (yield SchemaRoulettePoints_1.default.findOne({
                                guildId: interaction.guildId,
                                userId: (_h = interaction.user) === null || _h === void 0 ? void 0 : _h.id,
                            })) || { p: "لايوجد" };
                            const rows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                .setEmoji("<:security1:1329156583992590456>")
                                .setLabel("الحمايه الشخصيه")
                                .setDisabled(disableS)
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId(`roulette_secruity_${interaction.user.id}_${(_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.id}_${data === null || data === void 0 ? void 0 : data.msgId}_${data === null || data === void 0 ? void 0 : data.number}`), new discord_js_1.ButtonBuilder()
                                .setEmoji("<:star:1328433221536583831>")
                                .setLabel("دبل نقاط")
                                .setDisabled(disableDobule)
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId(`roulette_dobule_${interaction.user.id}_${(_k = interaction.guild) === null || _k === void 0 ? void 0 : _k.id}_${data === null || data === void 0 ? void 0 : data.msgId}_${data === null || data === void 0 ? void 0 : data.number}`), new discord_js_1.ButtonBuilder()
                                .setEmoji("<:Arrow1:1299711671052402718>")
                                .setLabel(`تملك: ${findPoints.p}`)
                                .setDisabled(true)
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId(`DisablePoints`));
                            yield interaction.reply({
                                content: `
1. <:star:1328433221536583831> دبل نقاط
يتم الحصول على دبل نقاط للكل
تحتاج الى : **50 عمله**َ
2. <:security1:1329156583992590456> الحمايه الشخصيه 
يتم حمايتك من الحارس الشخصي 
تحتاج الى : **100 عمله**
3. <:emoji_24:1327724457732603945> الغاء جوله روليت
يتم تحديد شخص من بداية الجوله اذا تم اختياره للمره الاولى لايتمكن.
تحتاج الى : **150 عمله**
مره واحده للجميع!`,
                                ephemeral: true,
                                components: [rows],
                            });
                        }
                        if (interaction.customId === "joingame" && data) {
                            const findGame = yield SchemaRoulette_1.default.findOne({
                                guildId: (_l = message.guild) === null || _l === void 0 ? void 0 : _l.id,
                                channelId: message.channel.id,
                                msgId: msg.id,
                            });
                            const findisReadyPlayer = yield (findGame === null || findGame === void 0 ? void 0 : findGame.players.find(p => p.userId === interaction.user.id));
                            // if(findisReadyPlayer) {
                            //   await interaction.reply({
                            //     content: `${emoji.false} | انت داخل اللعبه بلفعل!`,
                            //     ephemeral: true
                            //   });
                            //   return;
                            // }
                            findGame === null || findGame === void 0 ? void 0 : findGame.players.push({
                                user: interaction.user,
                                username: username,
                                userId: interaction.user.id,
                                number: data.number + 1,
                                image: interaction.user.displayAvatarURL({
                                    size: 256,
                                    extension: "png",
                                }),
                            });
                            findGame === null || findGame === void 0 ? void 0 : findGame.save();
                            //add number to use next player
                            data.number += 1;
                            const gameData = yield SchemaRoulette_1.default.findOne({
                                guildId: (_m = message.guild) === null || _m === void 0 ? void 0 : _m.id,
                                channelId: message.channel.id,
                                msgId: msg.id,
                            });
                            // تعريف المتغيرات
                            const PlayersmapToString = findGame && Array.isArray(findGame.players) && findGame.players.length > 0
                                ? findGame.players
                                    .map((data, index) => `<@${data.userId}> | #${index + 1}`)
                                    .join("\n")
                                : "لايوجد";
                            try {
                                if (embd.data.fields) {
                                    // embd.data.fields[1].value =  PlayersmapToString,
                                    embd.data.fields[1].value = `${PlayersmapToString || "لايوجد"}`;
                                    // تحديث التفاعل بالرسالة الجديدة
                                    yield interaction.update({ embeds: [embd] });
                                }
                            }
                            catch (error) {
                                console.error("حدث خطأ أثناء تحديث الرسالة:", error);
                            }
                        }
                        if (interaction.customId === "leavegame") {
                            const gameData = yield SchemaRoulette_1.default.findOne({
                                guildId: (_o = message.guild) === null || _o === void 0 ? void 0 : _o.id,
                                channelId: message.channel.id,
                                msgId: msg.id,
                            });
                            if (gameData) {
                                const index = gameData.players.findIndex((player) => player.user.id === interaction.user.id);
                                if (index !== -1) {
                                    const removedPlayer = gameData.players.splice(index, 1)[0];
                                    yield gameData.save();
                                    if (embd.data.fields) {
                                        gameData.players = gameData.players;
                                        yield gameData.save();
                                        //Delete in Player in Filed
                                        embd.data.fields = embd.data.fields.filter((field) => !field.value.includes(`<@${removedPlayer.userId}>`));
                                        yield interaction.update({ embeds: [embd] });
                                    }
                                    yield interaction.reply({
                                        content: `${emojis_1.default.true} | تم الخروج من الروليت`,
                                        ephemeral: true,
                                    });
                                }
                                else {
                                    yield interaction.reply({
                                        content: `${emojis_1.default.false} | لم تنضم الى الروليت للخروج!`,
                                        ephemeral: true,
                                    });
                                }
                            }
                            else {
                                yield interaction.reply({
                                    content: `${emojis_1.default.false} | اللعبه غير متوفره بلوقت الحالي`,
                                    ephemeral: true,
                                });
                            }
                        }
                    }));
                }
            }
            catch (err) {
                console.error("Error in roulette game:", err);
            }
        });
    }
}
exports.default = Roulette;
