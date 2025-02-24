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
exports.startRouletteGame = exports.disabledMultipleButtons = void 0;
const discord_js_1 = require("discord.js");
const roulette_image_1 = require("roulette-image");
const SchemaRoulette_1 = __importDefault(require("../../schema/Roulette/SchemaRoulette"));
const SchemaRoulettePoints_1 = __importDefault(require("../../schema/Roulette/SchemaRoulettePoints"));
;
const disabledMultipleButtons = (mm_1, specific_custom_id_1, username_1, ...args_1) => __awaiter(void 0, [mm_1, specific_custom_id_1, username_1, ...args_1], void 0, function* (mm, specific_custom_id, username, is_leave = false) {
    mm.components.forEach((a, i) => {
        a.components.forEach((b, e) => {
            if (specific_custom_id &&
                mm.components[i].components[e].custom_id.includes(specific_custom_id)) {
                mm.components[i].components[e].disabled = is_leave ? false : true;
                if (username) {
                    mm.components[i].components[e].label = is_leave
                        ? `${+mm.components[i].components[e].custom_id.split("_")[1] + 1}`
                        : username;
                }
            }
            else if (!specific_custom_id) {
                mm.components[i].components[e].disabled = true;
            }
        });
    });
    return mm.components;
});
exports.disabledMultipleButtons = disabledMultipleButtons;
function getMultipleButtons(all_buttons) {
    let components = [];
    for (let i = 0; i < all_buttons.length; i += 5) {
        let component = { components: [], type: 1 };
        for (let btn of all_buttons.slice(i, i + 5)) {
            component.components.push(btn);
        }
        components.push(component);
    }
    return components;
}
;
function sendGameMessage(message, // Or use Message if you're not using slash commands
winner, players, id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Generate buttons for players
        const buttons = players
            .slice(0, -1) // Remove the last player
            .slice(0, 24) // Discord limit: Max 25 buttons per action row
            .map((player) => new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Secondary) // Secondary button style
            .setLabel(`${player.number + 1}. ${player.username}`)
            .setEmoji("<:emoji_33:1327724772167127201>")
            .setCustomId(`roulette_kick_${player.userId}_${message.guildId}_${id}_${player.number}`));
        // Add the "Withdraw" button
        buttons.push(new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Danger) // Danger button style
            .setLabel("انسحاب") // Arabic for "Withdraw"
            .setEmoji("<:emoji_30:1327724585562407024>>")
            .setCustomId(`roulette_withdraw_${winner.userId}_${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}_${id}_${winner === null || winner === void 0 ? void 0 : winner.number}`));
        const buttonss = [];
        buttonss.push(new discord_js_1.ButtonBuilder()
            .setEmoji("<:emoji_24:1327724457732603945>")
            .setLabel("إلغاء جوله روليت")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setCustomId(`roulette_cancel_${winner.user.id}_${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.id}_${id}_${winner === null || winner === void 0 ? void 0 : winner.number}`));
        // Group buttons into ActionRows (max 5 buttons per row)
        const rows2 = [];
        for (let i = 0; i < buttonss.length; i += 5) {
            rows2.push(new discord_js_1.ActionRowBuilder().addComponents(buttonss.slice(i, i + 5)));
        }
        // Send the message
        const gameMessage = yield message.channel.send({
            content: `<@${winner.userId}> لديك **15 ثانية** لإختيار لاعب لطرده`, // Arabic: "You have 30 seconds to select a player to kick"
            components: rows2,
        });
        setTimeout(function () {
            var _a;
            buttons.push(new discord_js_1.ButtonBuilder()
                .setEmoji("<:emoji_24:1327724457732603945>")
                .setLabel("إلغاء جوله روليت")
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setCustomId(`roulette_cancel_${winner.user.id}_${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}_${id}_${winner === null || winner === void 0 ? void 0 : winner.number}`));
            const rows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                rows.push(new discord_js_1.ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
            }
            gameMessage.edit({
                content: `<@${winner.userId}> لديك **15 ثانية** لإختيار لاعب لطرده`, // Arabic: "You have 30 seconds to select a player to kick"
                components: rows
            });
        }, 3000);
        const msgcoll = gameMessage.createMessageComponentCollector({
            time: 15000, // الوقت المسموح لجمع التفاعلات
            filter: f => !f.user.bot, // استبعاد البوتات
            componentType: discord_js_1.ComponentType.Button, // تحديد أن التفاعل المطلوب هو ضغط زر
        });
        msgcoll.on("end", (collected) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (collected.size === 0) {
                const components = gameMessage.components.map((row) => {
                    const actionRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((component) => {
                        var _a, _b, _c, _d, _e;
                        if (component.type === discord_js_1.ComponentType.Button) {
                            const buttonData = Object.assign(Object.assign({}, component), { url: (_a = component.url) !== null && _a !== void 0 ? _a : undefined, label: (_b = component.label) !== null && _b !== void 0 ? _b : "زر بدون عنوان", style: (_c = component.data.style) !== null && _c !== void 0 ? _c : discord_js_1.ButtonStyle.Primary, custom_id: (_d = component.customId) !== null && _d !== void 0 ? _d : `${message.author.id}_${winner.number}`, emoji: (_e = component.emoji) !== null && _e !== void 0 ? _e : { name: ":fire:" }, disabled: true });
                            if (!buttonData.label && !component.data.emoji) {
                                buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
                            }
                            actionRow.addComponents(new discord_js_1.ButtonBuilder(buttonData));
                        }
                    });
                    return actionRow;
                });
                yield gameMessage.edit({
                    components: components.map((row) => row.toJSON()),
                });
                gameMessage.reply({
                    content: `<:emoji_29:1327724572635697345> | لم يتم التفاعل مع الزر! لذا تم طرد <@${winner.userId}>`
                });
                const findRoulette = yield SchemaRoulette_1.default.findOne({
                    guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                    channelId: (_b = message.channel) === null || _b === void 0 ? void 0 : _b.id,
                    msgId: id,
                });
                const find = findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.find((p) => p.number === Number(winner.number));
                if (find && findRoulette) {
                    findRoulette.players = findRoulette.players.filter((x) => x.number != Number(winner.number));
                    yield findRoulette.save();
                }
                yield (0, exports.startRouletteGame)(message, findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players, message.client, id);
            }
        }));
        return gameMessage;
    });
}
const startRouletteGame = (message, users, client, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Define the available colors for the roulette wheel
        const colorsGradient = [
            "#32517f",
            "#4876a3",
            "#5d8ec7",
            "#74a6eb",
            "#8ac0ff",
        ];
        // Example options for players, you can adjust this to fetch users dynamically
        const options = users.map((data) => ({
            user: data.user, // Replace with actual user information
            label: data.username,
            color: colorsGradient[Math.floor(Math.random() * colorsGradient.length)], // Random color
        }));
        const sectors = users.map((data) => ({
            user: data.user,
            number: data.number,
            username: data.username,
            userId: data.userId,
            color: colorsGradient[Math.floor(Math.random() * colorsGradient.length)], // Random color
            image: data.image,
        }));
        if (message.channel instanceof discord_js_1.TextChannel) {
            let players = (0, roulette_image_1.shuffleArray)(sectors.sort((a, b) => a.number - b.number, 0));
            let winnerr = players[players.length - 1];
            // let bufferRouletteImage = await createRouletteGifImage(players);
            // await message.channel.send({
            //   content: `**${winner.number + 1}** - <@${winner.userId}>`,
            //   files: [
            //     {
            //       attachment: bufferRouletteImage,
            //       name: "roulette.gif",
            //     },
            //   ],
            // });
            const { Wheel } = require('roulette-gif');
            const wheel = new Wheel();
            let { buffer, winner, lastFrame } = yield wheel.createGif({
                slots: sectors.sort((a, b) => a.number - b.number, 0),
                stream: false, // Set it to true if you want to return stream insted of buffer
                wheelStroke: {
                    color: '#fff',
                    width: 5
                },
                slotStroke: {
                    color: '#fff',
                    width: 5
                },
                imageStroke: {
                    color: '#fff',
                    width: 5
                },
                // winnerSlotColor: 'Gold'
            });
            yield message.channel.send({
                content: `**${winner.number}** - <@${winner.userId}>`,
                files: [
                    {
                        attachment: buffer,
                        name: "roulette.gif",
                    },
                ],
            });
            if (players.length <= 2 && message.channel instanceof discord_js_1.TextChannel) {
                yield message.channel.send({
                    content: `:crown: - فاز <@!${winner.userId}> في اللعبة`,
                });
                const findRoulette = yield SchemaRoulette_1.default.findOne({
                    guildId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
                    channelId: (_b = message.channel) === null || _b === void 0 ? void 0 : _b.id,
                    msgId: id,
                });
                const xpJoiner = 2;
                const xpWinner = 5;
                const xpJoinerDobule = xpJoiner * 2;
                const xpWinnerDobule = xpWinner * 2;
                findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.players.forEach((p) => __awaiter(void 0, void 0, void 0, function* () {
                    const findP = yield SchemaRoulettePoints_1.default.findOne({
                        userId: p.userId,
                        guildId: message === null || message === void 0 ? void 0 : message.guildId,
                    });
                    if ((findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.dobule) === true) {
                        if (!findP) {
                            if (winner.userId === p.userId) {
                                new SchemaRoulettePoints_1.default({
                                    guildId: message === null || message === void 0 ? void 0 : message.guildId,
                                    userId: p.userId,
                                    p: xpWinnerDobule
                                }).save();
                            }
                            else {
                                new SchemaRoulettePoints_1.default({
                                    guildId: message === null || message === void 0 ? void 0 : message.guildId,
                                    userId: p.userId,
                                    p: xpJoinerDobule
                                }).save();
                            }
                        }
                        else {
                            if (winner.userId === p.userId) {
                                findP.p += xpWinnerDobule;
                                yield findP.save();
                            }
                            else {
                                findP.p += xpJoinerDobule;
                                yield findP.save();
                            }
                        }
                    }
                    else {
                        const findP = yield SchemaRoulettePoints_1.default.findOne({
                            guildId: message === null || message === void 0 ? void 0 : message.guildId,
                            userId: p.userId
                        });
                        if (!findP) {
                            if (winner.userId === p.userId) {
                                new SchemaRoulettePoints_1.default({
                                    guildId: message === null || message === void 0 ? void 0 : message.guildId,
                                    userId: p.userId,
                                    p: xpWinner
                                }).save();
                            }
                            else {
                                new SchemaRoulettePoints_1.default({
                                    guildId: message === null || message === void 0 ? void 0 : message.guildId,
                                    userId: p.userId,
                                    p: xpJoiner
                                }).save();
                            }
                        }
                        else {
                            if (winner.userId === p.userId) {
                                findP.p += xpWinner;
                                yield findP.save();
                            }
                            else {
                                findP.p += xpJoiner;
                                yield findP.save();
                            }
                        }
                        yield (findRoulette === null || findRoulette === void 0 ? void 0 : findRoulette.deleteOne());
                    }
                }));
            }
            else {
                yield sendGameMessage(message, winner, players, id);
            }
        }
    }
    catch (err) {
        console.error("Error in starting roulette game:", err);
    }
});
exports.startRouletteGame = startRouletteGame;
