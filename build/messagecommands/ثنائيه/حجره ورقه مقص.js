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
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const rank_1 = __importDefault(require("../../utils/functions/rank"));
const SchemaUsers_1 = __importDefault(require("../../schema/SchemaUsers"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const RPS = require("discord-rock-paper-scissor");
const rps = new RPS();
class اكس extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "حجره",
            description: "لعبه حجره ( حجره ورقه مقص )",
            category: Category_1.default.ثنائيه,
            cooldown: 3,
            aliases: [],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const args = message.content.split(" ");
            let member;
            const botId = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
            if (args[1] === "بوت") {
                member = this.client.user;
            }
            else {
                member = (_b = message.mentions.users) === null || _b === void 0 ? void 0 : _b.first();
            }
            const choices = [
                {
                    name: "حجره",
                    customId: "Rock",
                    emoji: "🪨",
                    beats: "Scissors",
                },
                {
                    name: "ورقه",
                    customId: "Paper",
                    emoji: "📄",
                    beats: "Rock",
                },
                {
                    name: "مقص",
                    customId: "Scissors",
                    emoji: "✂️",
                    beats: "Paper",
                },
            ];
            if (!member) {
                if (!message.guild)
                    return;
                const embed = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                    title: "مهلا",
                    des: `${emojis_1.default.false} | تأكد من منشن عضو او كتابه كلمه بوت!`,
                    line: false,
                    footer: "Error.",
                    fields: "Error"
                }, 'Error');
                if (embed) {
                    yield message.reply({
                        embeds: [embed],
                    });
                    return;
                }
            }
            if (message.author.id === (member === null || member === void 0 ? void 0 : member.id) && message.guild) {
                const embedCh = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                    title: "مهلا",
                    des: `${emojis_1.default.false} | تأكد من عدم منشن نفسك او بوت!`,
                    line: false,
                    footer: "Error.",
                    fields: "Error"
                }, 'Error');
                if (embedCh) {
                    yield message.reply({
                        embeds: [embedCh],
                    });
                    return;
                }
            }
            if (!message.guild)
                return;
            const embed = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                title: "قبول اللعبه",
                des: `<@${member === null || member === void 0 ? void 0 : member.id}> | هل تريد العب ضد <@${(_c = message.author) === null || _c === void 0 ? void 0 : _c.id}>`,
                line: false,
                footer: "حجره",
                fields: "حجره",
            }, "Base");
            const rowSend = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setLabel(`قبول`)
                .setCustomId(`true-${message.author.id}`)
                .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
                .setLabel(`رفض`)
                .setCustomId(`false-${message.author.id}`)
                .setStyle(discord_js_1.ButtonStyle.Danger));
            if (!(member === null || member === void 0 ? void 0 : member.bot)) {
                if (message.channel instanceof discord_js_1.TextChannel) {
                    if (embed) {
                        const sendInteraction = yield message.channel.send({
                            embeds: [embed],
                            components: [rowSend],
                        });
                        const MessagetargetUserInteraction = yield sendInteraction
                            .awaitMessageComponent({
                            filter: (i) => i.user.id === (member === null || member === void 0 ? void 0 : member.id),
                            time: 10000,
                        })
                            .catch((error) => __awaiter(this, void 0, void 0, function* () {
                            embed.setDescription(`<@${member === null || member === void 0 ? void 0 : member.id}> | انتهى الوقت ولم يستجيب.`);
                            yield sendInteraction.edit({
                                embeds: [embed],
                                components: [],
                            });
                            return;
                        }));
                        if (!MessagetargetUserInteraction)
                            return;
                        if (MessagetargetUserInteraction.customId === `true-${message.author.id}`) {
                            if (message.guild) {
                                const embeddone = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                                    title: "تم قبول اللعبه",
                                    des: `${emojis_1.default.true} | تم قبول اللعبه`,
                                    line: false,
                                    footer: "حجره",
                                    fields: "حجره",
                                }, "Success");
                                if (embeddone) {
                                    yield sendInteraction.edit({
                                        embeds: [embeddone],
                                        components: [],
                                    });
                                    startGame(this.client);
                                }
                            }
                        }
                        else if (MessagetargetUserInteraction.customId === `false-${message.author.id}`) {
                            const embedwarn = yield (0, BaseEmbed_1.default)(this.client, message.guild, {
                                title: "مهلا",
                                des: `${emojis_1.default.false} | تم رفض قبول اللعبه`,
                                line: false,
                                footer: "Error.",
                                fields: "Error"
                            }, 'Error');
                            if (embedwarn) {
                                yield sendInteraction.edit({
                                    embeds: [embedwarn],
                                    components: [],
                                });
                                return;
                            }
                        }
                    }
                }
                else {
                    startGame(this.client);
                }
                function startGame(client) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        if (!message.guild)
                            return;
                        const emb = yield (0, BaseEmbed_1.default)(client, message.guild, {
                            line: false,
                            title: "حان دور اللعب!",
                            footer: `دور <@${member === null || member === void 0 ? void 0 : member.id}> للعب!`,
                            fields: `حان دور <@${member === null || member === void 0 ? void 0 : member.id}> ل اللعب!`,
                        }, "Base");
                        if (emb) {
                            const row = new discord_js_1.ActionRowBuilder().addComponents(choices.map((choice) => {
                                return new discord_js_1.ButtonBuilder()
                                    .setCustomId(choice.customId)
                                    .setLabel(choice.name)
                                    .setStyle(discord_js_1.ButtonStyle.Primary)
                                    .setEmoji(choice.emoji);
                            }));
                            const reply = yield message.reply({
                                content: `<@${message.author.id}> ⚔️ <@${member === null || member === void 0 ? void 0 : member.id}>`,
                                embeds: [emb],
                                components: [row],
                            });
                            const randomcho = choices[Math.floor(Math.random() * choices.length)];
                            if (!(member === null || member === void 0 ? void 0 : member.bot)) {
                                const targetUserInteraction = yield reply
                                    .awaitMessageComponent({
                                    filter: (i) => i.user.id === (member === null || member === void 0 ? void 0 : member.id),
                                    time: 10000,
                                })
                                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                                    emb.setDescription(`<@${member === null || member === void 0 ? void 0 : member.id}> | انتهى الوقت ولم يستجيب.`);
                                    yield reply.edit({
                                        embeds: [emb],
                                        components: [],
                                    });
                                    return;
                                }));
                                if (!targetUserInteraction)
                                    return;
                                const targetUserChoice = choices.find((choice) => choice.customId === targetUserInteraction.customId);
                                yield targetUserInteraction.reply({
                                    content: `لقد اختار ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.name} ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.emoji}`,
                                    ephemeral: true,
                                });
                                emb.setDescription(`حان دور <@${(_a = message.author) === null || _a === void 0 ? void 0 : _a.id}> ل العب!`);
                                yield reply.edit({
                                    content: `<@${message.author.id}> حان دور الان!`,
                                    embeds: [emb],
                                });
                                const initialUserIntercation = yield reply
                                    .awaitMessageComponent({
                                    filter: (i) => { var _a; return i.user.id === ((_a = message.author) === null || _a === void 0 ? void 0 : _a.id); },
                                    time: 15000,
                                })
                                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                                    var _a;
                                    emb.setDescription(`<@${(_a = message.author) === null || _a === void 0 ? void 0 : _a.id}> | انتهى الوقت ولم يستجيب.`);
                                    yield reply.edit({
                                        embeds: [emb],
                                        components: [],
                                    });
                                }));
                                if (!initialUserIntercation)
                                    return;
                                const initialUserChoice = choices.find((choice) => choice.customId === initialUserIntercation.customId);
                                let result;
                                if ((targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.beats) === (initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.customId)) {
                                    result = `<@${member === null || member === void 0 ? void 0 : member.id}> فاز!`;
                                }
                                if ((initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.beats) === (targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.customId)) {
                                    result = `<@${(_b = message.author) === null || _b === void 0 ? void 0 : _b.id}> فاز!`;
                                }
                                if ((targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.customId) === (initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.customId)) {
                                    result = `!تعادل`;
                                }
                                emb.setDescription(`
        <@${member === null || member === void 0 ? void 0 : member.id}> اختار ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.name} ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.emoji}\n
        <@${(_c = message.author) === null || _c === void 0 ? void 0 : _c.id}> اختار ${initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.name} ${initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.emoji} 
        \n\n${result}`);
                                yield reply.edit({
                                    embeds: [emb],
                                    components: [],
                                });
                            }
                            else {
                                const targetUserChoice = choices.find((choice) => choice.customId === randomcho.customId);
                                emb.setDescription(`حان دور <@${(_d = message.author) === null || _d === void 0 ? void 0 : _d.id}> ل العب!`);
                                yield reply.edit({
                                    content: `<@${message.author.id}> حان دور الان!`,
                                    embeds: [emb],
                                });
                                const initialUserIntercation = yield reply
                                    .awaitMessageComponent({
                                    filter: (i) => { var _a; return i.user.id === ((_a = message.author) === null || _a === void 0 ? void 0 : _a.id); },
                                    time: 15000,
                                })
                                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                                    var _a;
                                    emb.setDescription(`<@${(_a = message.author) === null || _a === void 0 ? void 0 : _a.id}> | انتهى الوقت ولم يستجيب.`);
                                    yield reply.edit({
                                        embeds: [emb],
                                        components: [],
                                    });
                                }));
                                if (!initialUserIntercation)
                                    return;
                                const initialUserChoice = choices.find((choice) => choice.customId === initialUserIntercation.customId);
                                let result;
                                let winner;
                                if ((targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.beats) === (initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.customId)) {
                                    result = `<@${member === null || member === void 0 ? void 0 : member.id}> فاز!`;
                                    winner = member === null || member === void 0 ? void 0 : member.id;
                                }
                                if ((initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.beats) === (targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.customId)) {
                                    result = `<@${(_e = message.author) === null || _e === void 0 ? void 0 : _e.id}> فاز!`;
                                    winner = message.author.id;
                                }
                                if ((targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.customId) === (initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.customId)) {
                                    result = `!تعادل`;
                                    winner = botId;
                                }
                                emb.setDescription(`
      اخترت ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.name} ${targetUserChoice === null || targetUserChoice === void 0 ? void 0 : targetUserChoice.emoji}\n
      <@${(_f = message.author) === null || _f === void 0 ? void 0 : _f.id}> اختار ${initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.name} ${initialUserChoice === null || initialUserChoice === void 0 ? void 0 : initialUserChoice.emoji} 
      \n\n${result}`);
                                if (winner !== botId) {
                                    const schema_2 = (yield SchemaUsers_1.default.findOne({
                                        guildId: (_g = message.guild) === null || _g === void 0 ? void 0 : _g.id,
                                        userId: winner,
                                    })) ||
                                        new SchemaUsers_1.default({
                                            guildId: (_h = message.guild) === null || _h === void 0 ? void 0 : _h.id,
                                            userId: winner,
                                            p: 0,
                                        });
                                    schema_2.p += 1;
                                    yield schema_2.save();
                                    const rank_2 = (0, rank_1.default)(schema_2.p);
                                    const schema_3 = (yield SchemaUsers_1.default.findOne({
                                        guildId: (_j = message.guild) === null || _j === void 0 ? void 0 : _j.id,
                                        userId: winner,
                                    })) || { p: 1 };
                                    const btns = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                        .setEmoji(rank_2.emoji)
                                        .setCustomId("rank_info")
                                        .setStyle(discord_js_1.ButtonStyle.Secondary)
                                        .setLabel(`${rank_2.name} ( ${schema_3.p} )`));
                                    yield reply.edit({
                                        embeds: [emb],
                                        components: [btns],
                                    });
                                }
                                else {
                                    yield reply.edit({
                                        embeds: [emb],
                                        components: [],
                                    });
                                }
                            }
                        }
                    });
                }
                //       let mid: string;
                //       const args = message.content.split(" ").slice(1);
                //       const text = args[0];
                //        if(message.channel instanceof TextChannel) {
                //        if(!text) {
                //          message.channel.send({
                //           embeds: [mainembed(`يرجى كتابه بعد الامر \n \` بوت \` او \` منشن الاعب \` `)]
                //         })
                //         return;
                //       }
                // if(text === "بوت" || member)  {
                //   mid = member ? member.id : 'bot';
                //       const buttons1 = new ActionRowBuilder<ButtonBuilder>()
                //       .addComponents(
                //         new ButtonBuilder()
                //         .setLabel("حجره")
                //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                //         .setStyle(ButtonStyle.Secondary)
                //         .setCustomId(`button_1`),
                //         new ButtonBuilder()
                //         .setLabel("ورقه")
                //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                //         .setStyle(ButtonStyle.Secondary)
                //         .setCustomId(`button_2`),
                //         new ButtonBuilder()
                //         .setLabel("مقص")
                //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                //         .setStyle(ButtonStyle.Secondary)
                //         .setCustomId(`button_3`),
                //       );
                // //       const buttons2 = new ActionRowBuilder<ButtonBuilder>()
                // //       .addComponents(
                // //         new ButtonBuilder()
                // //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //         .setStyle(ButtonStyle.Secondary)
                // //         .setCustomId(`button_4`),
                // //                  new ButtonBuilder()
                // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //       .setStyle(ButtonStyle.Secondary)
                // //       .setCustomId(`button_5`),
                // //              new ButtonBuilder()
                // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //       .setStyle(ButtonStyle.Secondary)
                // //       .setCustomId(`button_6`),
                // //       );
                // //       const buttons3 = new ActionRowBuilder<ButtonBuilder>()
                // //       .addComponents(
                // //         new ButtonBuilder()
                // //         .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //         .setStyle(ButtonStyle.Secondary)
                // //         .setCustomId(`button_7`),
                // //                  new ButtonBuilder()
                // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //       .setStyle(ButtonStyle.Secondary)
                // //       .setCustomId(`button_8`),
                // //              new ButtonBuilder()
                // //       .setEmoji("<:Picsart_241028_170653120:1303325780704759868>")
                // //       .setStyle(ButtonStyle.Secondary)
                // //       .setCustomId(`button_9`),
                // //       );
                //       const messageFetch = await message.reply({
                //         content: `حان دور ${member ? `<@${member.id}>` : 'البوت'}`,
                //         components: [buttons1]
                //       });
                //       const coll = await messageFetch.createMessageComponentCollector({
                //       componentType: ComponentType.Button,
                //       time: 10000,
                //       filter: m => !m.user.bot
                //       });
                //       coll.on("collect", async (m) => {
                //         if(m.user.id === mid || mid === "bot") {
                //           if(mid !== "bot") {
                //             const [, id] = m.customId.split("_")
                //             const btn = await m.message.components.map((com) => {
                //               const f = com.components.some(row => row.customId?.includes(`_${id}`));
                //               const fff = com.components.find(row => row.customId?.includes(`_${id}`));
                //             });
                //             await messageFetch.edit({
                //               content: `لقد اختار ${member ? : ''}`,
                //               components: [
                //                 new ActionRowBuilder<ButtonBuilder>().addComponents(
                //                   ...m.message.components[0].components.map((com) => {
                //                     if (com.customId?.includes(`_${id}`)) {
                //                       return ButtonBuilder.from(com as APIButtonComponent).setDisabled(true);
                //                     }
                //                     return ButtonBuilder.from(com as APIButtonComponent);
                //                   })
                //                 ),
                //               ],
                //             });
                //         } else {
                //           m.reply({
                //             content: `:x: | حان دور البوت او الخصم`,
                //             ephemeral: true
                //           });
                //           return;
                //         }
                //         }
                //        });
                //        } else {
                //       message.channel.send({
                //         embeds: [mainembed(`يرجى كتابه بعد الامر \n \` بوت \` او \` منشن الاعب \` `)]
                //       });
                //       return;
                //     }
            }
        });
    }
}
exports.default = اكس;
