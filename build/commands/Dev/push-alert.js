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
const SchemaChannel_1 = __importDefault(require("../../schema/SchemaChannel"));
const mainEmbed_1 = __importDefault(require("../../utils/embeds/mainEmbed"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const SchemaPushStatus_1 = __importDefault(require("../../schema/SchemaPushStatus"));
class push extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("pushh")
                .setDescription("push updates.")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((sub) => sub
                .setName("updates")
                .setDescription("push updates.")
                .addStringOption((string) => string
                .setName("version")
                .setRequired(true)
                .setDescription("verision update."))
                .addStringOption((string) => string
                .setName("message")
                .setRequired(true)
                .setDescription("messageId to get message update."))),
            category: Category_1.default.Dev,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                const version = interaction.options.getString("version");
                const message = interaction.options.getString("message");
                const UsersAllow = ["709981152093667359"];
                if (!UsersAllow.includes(interaction.user.id)) {
                    return interaction.editReply({
                        content: "!",
                    });
                }
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return interaction.editReply({
                        content: `${emojis_1.default.false} | ?`,
                    });
                }
                const schemaFindDatas = yield SchemaChannel_1.default.find();
                if (typeof message === "string") {
                    const messageFetched = yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.messages.fetch(message));
                    let messageContentOrEmbedContent;
                    if ((messageFetched === null || messageFetched === void 0 ? void 0 : messageFetched.embeds.length) === 0) {
                        messageContentOrEmbedContent = messageFetched.content;
                    }
                    else {
                        messageContentOrEmbedContent =
                            ((_c = messageFetched === null || messageFetched === void 0 ? void 0 : messageFetched.embeds[0]) === null || _c === void 0 ? void 0 : _c.description) || null;
                    }
                    for (let data of schemaFindDatas) {
                        if (Array.isArray(data.channelId)) {
                            for (let channelId of data.channelId) {
                                const query = yield SchemaPushStatus_1.default
                                    .findOne({ guildId: data.guildId })
                                    .catch(console.error);
                                if (query) {
                                    continue;
                                }
                                const channelCache = this.client.channels.cache.get(channelId);
                                if (!channelCache || !(channelCache instanceof discord_js_1.TextChannel)) {
                                    continue;
                                }
                                if (messageContentOrEmbedContent)
                                    try {
                                        const embUpdate = yield (0, mainEmbed_1.default)(messageContentOrEmbedContent, "New Update!", "New Update!");
                                        const btnUpdateRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                            .setLabel(`${version}V`)
                                            .setEmoji("🎉")
                                            .setDisabled(true)
                                            .setCustomId("version_disabled")
                                            .setStyle(discord_js_1.ButtonStyle.Danger));
                                        const sentMessage = yield channelCache.send({
                                            embeds: [embUpdate],
                                            components: [btnUpdateRow],
                                        });
                                        if ((_d = channelCache.guild.members.me) === null || _d === void 0 ? void 0 : _d.permissions.has("ManageMessages")) {
                                            yield sentMessage.pin();
                                        }
                                    }
                                    catch (err) {
                                        console.error("خطأ أثناء إرسال التحديث:", channelCache.id, err);
                                    }
                            }
                        }
                    }
                    yield interaction.editReply({
                        content: "Done ✅...",
                    });
                }
            }
            catch (error) {
                console.error("An unexpected error occurred : of command /push alert", error);
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Error")
                    .setDescription("Error. Please try again later.");
                interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
exports.default = push;
