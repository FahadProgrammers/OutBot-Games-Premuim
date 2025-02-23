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
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const SchemaPremuim_1 = __importDefault(require("../../schema/SchemaPremuim"));
const SchemaPremuimBots_1 = __importDefault(require("../../schema/SchemaPremuimBots"));
const ms_1 = __importDefault(require("ms"));
const moment_1 = __importDefault(require("moment"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const utils_1 = __importDefault(require("../../utils/utils"));
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class help extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("owners")
                .setDescription("owners...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommandGroup(command => command
                .setName('webhook')
                .setDescription('dd')
                .addSubcommand(command => command
                .setName('send')
                .setDescription('إرسال ويبهوك.')
                .addStringOption((string) => string
                .setName("messageid")
                .setRequired(true)
                .setDescription("ايدي رسالة الي يتم إرسالها."))
                .addBooleanOption((command) => command
                .setName('everyone')
                .setDescription('ارسال في الرسال منشن ايفريون True/False.').setRequired(true))
                .addStringOption((command) => command
                .setName('title')
                .setDescription("عنوان رسالة الايمبد.").setRequired(true))))
                .addSubcommandGroup(command => command
                .setName('premuim')
                .setDescription(`إعطاء بريوميم الى شخص معين.`)
                .addSubcommand(command => command
                .setName('remove')
                .setDescription("إزالة بريوميم من شخص معين.")
                .addUserOption(command => command
                .setName('member')
                .setDescription('تحديد الشخص ل إزالته.')
                .setRequired(true)))
                .addSubcommand(command => command
                .setName('botadd')
                .setDescription("إضافة بوت بريوميم.")
                .addStringOption(user => user
                .setName("token")
                .setRequired(true)
                .setDescription("token bot"))
                .addStringOption(string => string
                .setName("botid")
                .setRequired(true)
                .setDescription("guild of set")))
                .addSubcommand(commandd => commandd
                .setName('add')
                .setDescription(`إعطاء بريوميم الى شخص معين.`)
                .addUserOption((user) => user
                .setName("owner")
                .setRequired(true)
                .setDescription("owner to get bot"))
                .addStringOption((string) => string
                .setName("guildid")
                .setRequired(true)
                .setDescription("guild of set"))
                .addStringOption((string) => string.setName("time").setRequired(true).setDescription("time")))),
            category: Category_1.default.Dev,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            yield interaction.deferReply({
                ephemeral: true,
            });
            const subCommand = interaction.options.getSubcommand();
            const owner = interaction.options.getUser("owner");
            const guildId = interaction.options.getString("guildid");
            const time = interaction.options.getString("time") || null;
            const safeTime = time !== null && time !== void 0 ? time : "String";
            const UsersAllow = [
                "1106701699260882984",
                "709981152093667359",
                "1125812790158962839",
            ];
            if (!UsersAllow.includes(interaction.user.id)) {
                return interaction.editReply({
                    content: "ممنوع يامعلم!",
                });
            }
            if (subCommand === "add") {
                try {
                    if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                        return interaction.editReply({
                            content: `${emojis_1.default.false} | ?`,
                        });
                    }
                    const endTime = (0, moment_1.default)().add((0, ms_1.default)(safeTime)).format("YYYY-MM-DD HH:mm:ss");
                    const findBotPrem = yield SchemaPremuimBots_1.default.findOne({ own: false });
                    if (!findBotPrem)
                        return interaction.editReply({ content: "مخلصه الكميه" });
                    new SchemaPremuim_1.default({
                        token: findBotPrem.token,
                        botId: findBotPrem.botId,
                        guildId,
                        owner: owner === null || owner === void 0 ? void 0 : owner.id,
                        time: endTime,
                        starttime: Date.now(),
                    }).save();
                    const findDataPremuimUser = yield SchemaPremuim_1.default.findOne({
                        guildId,
                        owner: owner === null || owner === void 0 ? void 0 : owner.id,
                    });
                    const user = yield interaction.client.users.cache.get((_b = owner === null || owner === void 0 ? void 0 : owner.id) !== null && _b !== void 0 ? _b : "");
                    const guild = yield interaction.guild;
                    const channel = yield guild.channels.cache.get(utils_1.default.premuimLogId);
                    user === null || user === void 0 ? void 0 : user.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setDescription(`<:Arrow1:1299711671052402718> تم تفعيل الإشتراك

تم بنجاح الإشتراك في بوت **OutBot Games** نتمنى الإستمتاع!`)
                                .setTimestamp()
                                .setFooter({
                                text: `OutBot Games - System`,
                                iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                            })
                                .setColor("Red")
                                .setAuthor({
                                name: `OutBot Games - System`,
                                iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                            }),
                        ],
                        components: [
                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                .setLabel("اضافه البوت")
                                .setStyle(discord_js_1.ButtonStyle.Link)
                                .setURL(`https://discord.com/oauth2/authorize?client_id=${findDataPremuimUser === null || findDataPremuimUser === void 0 ? void 0 : findDataPremuimUser.botId}&scope=bot+applications.commands+applications.commands.permissions.update&guild_id=${guildId}&disable_guild_select=true&permissions=2080374975`)
                                .setEmoji("<:Arrow1:1299711671052402718>")),
                        ],
                    });
                    yield interaction.editReply({
                        content: `☑️`,
                    });
                    const findDataPremuimUser2 = yield SchemaPremuim_1.default.findOne({
                        guildId,
                        owner: owner === null || owner === void 0 ? void 0 : owner.id,
                    });
                    if (findDataPremuimUser2) {
                        if (channel instanceof discord_js_1.TextChannel) {
                            channel === null || channel === void 0 ? void 0 : channel.send({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setDescription(`<:Arrow1:1299711671052402718>  تم تفعيل اشتراك

                    ايدي البوت: \`${findDataPremuimUser2.botId}\`
                    من قبل : \`${interaction.user.id}\`
                    المالك : \`${owner === null || owner === void 0 ? void 0 : owner.id}\`
                    بدا منذ ( ممكن تقريبا ) : <t:${Math.floor(findDataPremuimUser2.starttime.getTime() / 1000)}:R>
                    انتهاء منذ ( ممكن تقريبا ) : <t:${Math.floor(findDataPremuimUser2.time.getTime() / 1000)}:R>
                    `)
                                        .setTimestamp()
                                        .setFooter({
                                        text: `OutBot Games - System`,
                                        iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                                    })
                                        .setColor("Red")
                                        .setAuthor({
                                        name: `OutBot Games - System`,
                                        iconURL: `https://cdn.discordapp.com/attachments/726388631664852992/1300445722876841994/Picsart_24-10-28_17-06-53-120.png?ex=6734a475&is=673352f5&hm=d1fc71cff67b4f42ca769a445820253c57ee558b4e68e271fd01cf5e8100c4ea&`,
                                    }),
                                ],
                            });
                            const member = yield interaction.guild.members.cache.get((owner === null || owner === void 0 ? void 0 : owner.id) || "");
                            if (member) {
                                const premuimroleId = utils_1.default.premuimRoleId;
                                yield member.roles.add(premuimroleId);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error("An unexpected error occurred :", error);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Error")
                        .setDescription("Error. Please try again later.");
                    interaction.editReply({ embeds: [embed] });
                }
            }
            else if (subCommand === "botadd") {
                const tokenn = interaction.options.getString("token");
                const botIdd = interaction.options.getString("botid");
                if (interaction.user.id !== '709981152093667359') {
                    return interaction.editReply({
                        content: 'ممنوع يامعلم!',
                    });
                }
                try {
                    if (!((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id)) {
                        return interaction.editReply({
                            content: `${emojis_1.default.false} | حدث خطا في النظام`,
                        });
                    }
                    const find = yield SchemaPremuimBots_1.default.findOne({ token: tokenn });
                    if (find) {
                        yield interaction.editReply({
                            content: "متوفر بلداتا!!"
                        });
                        return;
                    }
                    new SchemaPremuimBots_1.default({
                        botId: botIdd,
                        token: tokenn,
                        own: false
                    }).save();
                    yield interaction.editReply({
                        content: `${emojis_1.default.true} | تم بنجاح!`,
                    });
                }
                catch (error) {
                    console.error('An unexpected error occurred :', error);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Error')
                        .setDescription('Error. Please try again later.');
                    interaction.editReply({ embeds: [embed] });
                }
            }
            else if (subCommand === "remove") {
                try {
                    const memberr = interaction.options.getUser('member');
                    const member = interaction.options.getMember('member');
                    const find = yield SchemaPremuim_1.default.find({ owner: member === null || member === void 0 ? void 0 : member.id });
                    yield find.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                        yield SchemaPremuim_1.default.deleteOne({ owner: data.owner });
                    }));
                    yield (member === null || member === void 0 ? void 0 : member.roles.remove(utils_1.default.premuimRoleId));
                    yield interaction.editReply({
                        content: `${emojis_1.default.true} | تم بنجاح إزالة البريوميم`
                    });
                }
                catch (error) {
                    console.error('An unexpected error occurred :', error);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Error')
                        .setDescription('Error. Please try again later.');
                    interaction.editReply({ embeds: [embed] });
                }
            }
            else if (interaction.options.getSubcommandGroup() === 'webhook' && interaction.options.getSubcommand() === 'send') {
                const messageId = interaction.options.getString("messageid");
                const title = interaction.options.getString("title");
                const everyone = interaction.options.getBoolean("everyone");
                try {
                    if (!((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id)) {
                        return interaction.editReply({
                            content: `${emojis_1.default.false} | ?`,
                        });
                    }
                    if (typeof messageId === "string") {
                        const messageFetched = yield ((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.messages.fetch(messageId));
                        let messageContentOrEmbedContent;
                        if ((messageFetched === null || messageFetched === void 0 ? void 0 : messageFetched.embeds.length) === 0) {
                            messageContentOrEmbedContent = messageFetched.content;
                        }
                        else {
                            messageContentOrEmbedContent =
                                ((_f = messageFetched === null || messageFetched === void 0 ? void 0 : messageFetched.embeds[0]) === null || _f === void 0 ? void 0 : _f.description) || null;
                        }
                        const findWebhooks = yield ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.fetchWebhooks());
                        let webhook = findWebhooks.find((web) => { var _a, _b; return ((_a = web.channel) === null || _a === void 0 ? void 0 : _a.id) === ((_b = messageFetched === null || messageFetched === void 0 ? void 0 : messageFetched.channel) === null || _b === void 0 ? void 0 : _b.id); });
                        const CacheGuild = yield this.client.guilds.cache.get((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.id);
                        if (!webhook) {
                            if (interaction.channel instanceof discord_js_1.TextChannel) {
                                webhook = yield ((_j = interaction.channel) === null || _j === void 0 ? void 0 : _j.createWebhook({
                                    name: interaction.guild.name,
                                    avatar: CacheGuild === null || CacheGuild === void 0 ? void 0 : CacheGuild.iconURL(),
                                }));
                            }
                        }
                        if (typeof messageContentOrEmbedContent === "string") {
                            const emb = (0, BaseEmbed_1.default)(interaction.guild, {
                                title: title !== null && title !== void 0 ? title : "dd",
                                des: messageContentOrEmbedContent,
                                line: true,
                                footer: "OutBot Team",
                                fields: "OutBot Team"
                            }, "Base");
                            if (emb) {
                                yield (webhook === null || webhook === void 0 ? void 0 : webhook.send({
                                    content: everyone ? "@everyone" : "",
                                    embeds: [
                                        emb
                                    ],
                                }));
                                yield interaction.editReply({
                                    content: "Done",
                                });
                            }
                        }
                    }
                }
                catch (error) {
                    console.error("An unexpected error occurred :", error);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Error")
                        .setDescription("Error. Please try again later.");
                    interaction.editReply({ embeds: [embed] });
                }
            }
        });
    }
}
exports.default = help;
