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
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const warnembed_1 = __importDefault(require("../../utils/embeds/warnembed"));
class Test extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("channel")
                .setDescription("channel...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command
                .setName("add")
                .setDescription(`إعداد الروم الخاص ب الالعاب.`)
                .addChannelOption((option) => option
                .setName("channel")
                .setDescription("عين القناه المراد اختيارها")
                .setRequired(true)
                .addChannelTypes(discord_js_1.ChannelType.GuildText)))
                .addSubcommand((command) => command
                .setName('remove')
                .setDescription(`إزالة الروم الخاص ب الالعاب.`)
                .addStringOption((option) => option
                .setName("remove")
                .setDescription("عين القناه المراد إزالتها")
                .setRequired(true)
                .setAutocomplete(true))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const subCommand = interaction.options.getSubcommand();
            yield interaction.deferReply({
                ephemeral: true,
            });
            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                return interaction.editReply({
                    content: `${emojis_1.default.false} | ?`,
                });
            }
            if (subCommand === "remove") {
                const data = (yield SchemaChannel_1.default.findOne({
                    guildId: interaction.guild.id,
                })) || null;
                const Targetchannel = interaction.options.getString("remove");
                const find = data === null || data === void 0 ? void 0 : data.channelId.find((data) => data === Targetchannel);
                const emb2 = (0, mainEmbed_1.default)(`❌ تاكد من اختيار عنصر صحيح او متوفر بقاعده البيانات `, `System`, `System`);
                if (Targetchannel === "" || !find) {
                    yield interaction.editReply({
                        embeds: [emb2],
                    });
                    return;
                }
                if (data && data.channelId) {
                    data.channelId = data.channelId.filter((channelId) => channelId !== find);
                    yield (data === null || data === void 0 ? void 0 : data.save());
                }
                if (interaction.guild) {
                    const emb = (0, BaseEmbed_1.default)(interaction.guild, {
                        title: "deletechannel",
                        des: `${emojis_1.default.true} تم حذف القناه ( \`${Targetchannel} \` )`,
                        line: true,
                        footer: `حذف قناه`,
                        fields: `حذف قناه`,
                    }, "Success");
                    if (emb) {
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                }
            }
            else if (subCommand === "add") {
                const channel = interaction.options.getChannel("channel");
                const schema_2 = (yield SchemaChannel_1.default.findOne({
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                })) || null;
                const emb = (0, BaseEmbed_1.default)(interaction.guild, {
                    title: "setchannel",
                    des: `${emojis_1.default.true} | تم بنجاح اضافه القناه`,
                    line: true,
                    footer: `#${channel.name}`,
                    fields: `#${channel.name}`,
                }, "Success");
                if (emb) {
                    const emb2 = (0, warnembed_1.default)(`${emojis_1.default.false} | هاذي القناه مضافه بلفعل`, `Error Channel`, `Error Channel`);
                    const emb2Full = (0, warnembed_1.default)(`
        ${emojis_1.default.false} | مهلا لقد وصلت الحد الاقصى ل القنوات **${schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.length} **
        للمزيد اشترك في [النسخه المطوره](https://discord.com/channels/1198628254043607070/1256976756485652480) 
          `, `Full Channels`, `Full Channels`);
                    if (schema_2) {
                        if ((schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.length) === 2) {
                            yield interaction.editReply({
                                embeds: [emb2Full],
                            });
                            return;
                        }
                        if (schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.includes(channel.id)) {
                            yield interaction.editReply({
                                embeds: [emb2],
                            });
                            return;
                        }
                        schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.channelId.push(channel.id);
                        yield (schema_2 === null || schema_2 === void 0 ? void 0 : schema_2.save());
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                    else {
                        new SchemaChannel_1.default({
                            guildId: interaction.guild.id,
                            channelId: [],
                        }).save();
                        const schema_3 = yield SchemaChannel_1.default.findOne({
                            guildId: interaction.guild.id,
                        });
                        schema_3 === null || schema_3 === void 0 ? void 0 : schema_3.channelId.push(channel.id);
                        yield (schema_3 === null || schema_3 === void 0 ? void 0 : schema_3.save());
                        yield interaction.editReply({
                            embeds: [emb],
                        });
                    }
                    const ActionRowBuilderPrefix = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setEmoji("<:menu:1315236684832440320>")
                        .setCustomId(`more_${interaction.guild.id}`)
                        .setStyle(discord_js_1.ButtonStyle.Secondary));
                    const message = yield channel.send({
                        content: `🎉 **تم بإذن الله تفعيل البوت في هاذي القناه.**
**سيتم تنزيل رساله للتحديثات الجديده ل اغلاقها**
<:Arrow1:1299711671052402718> /update status status: off`,
                        components: [ActionRowBuilderPrefix],
                    });
                    if ((_c = message.guild.members.me) === null || _c === void 0 ? void 0 : _c.permissions.has("ManageGuild")) {
                        yield message.pin();
                    }
                }
            }
        });
    }
}
exports.default = Test;
