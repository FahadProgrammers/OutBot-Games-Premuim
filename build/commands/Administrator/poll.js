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
const emojis_1 = __importDefault(require("../../utils/functions/emojis"));
const ms_1 = __importDefault(require("ms"));
class Test extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("poll")
                .setDescription("channel...")
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild | discord_js_1.PermissionFlagsBits.Administrator)
                .addSubcommand((command) => command
                .setName("start")
                .setDescription(`بدء تصويت لتحديد العبة.`)
                .addStringOption((command) => command.setName("select")
                .setDescription("تحديد نوع التصويت")
                .setRequired(true)
                .addChoices({ name: 'الالعاب الفردية فقط', value: "one" }, { name: 'الالعاب الثنائية فقط', value: 'two' }, { name: 'الالعاب الجماعية فقط', value: 'three' }, { name: "جميع الالعاب", value: 'all' }))
                .addStringOption((option) => option.setName("title").setDescription("عنوان التصويت").setRequired(true))
                .addStringOption((option) => option.setName("time").setDescription("مدة التصويت (مثال: 15s)").setRequired(true)))
                .addSubcommand((command) => command
                .setName('stop')
                .setDescription(`إيقاف التصويت.`)
                .addStringOption((option) => option.setName("messageid").setDescription("ايدي رسالة التصويت").setRequired(true))),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const subCommand = interaction.options.getSubcommand();
            const guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
            if (!guildId) {
                return interaction.reply({
                    content: `${emojis_1.default.false} | لا يمكن تنفيذ الأمر في هذه الخادم.`,
                    ephemeral: true,
                });
            }
            if (subCommand === "start") {
                const title = interaction.options.getString("title");
                const selectOption = interaction.options.getString("select");
                const time = interaction.options.getString("time");
                if (!title || !selectOption || !time) {
                    return interaction.reply({ content: "❌ جميع الخيارات مطلوبة.", ephemeral: true });
                }
                if (!(interaction.channel instanceof discord_js_1.TextChannel)) {
                    return interaction.reply({ content: "❌ يجب تنفيذ الأمر في قناة نصية.", ephemeral: true });
                }
                let answers = [];
                const categories = {
                    one: "فرديه",
                    two: "ثنائيه",
                    three: "مجموعه",
                    all: null,
                };
                // إصلاح تحقق الفئات
                if (categories[selectOption]) {
                    this.client.messagecommands.forEach((data) => {
                        if (data.category === categories[selectOption] && data.category !== Category_1.default.ادمن) {
                            answers.push(data.name);
                        }
                    });
                }
                else if (selectOption === "all") {
                    this.client.messagecommands.forEach((data) => {
                        if (data.category !== Category_1.default.ادمن) {
                            answers.push(data.name);
                        }
                    });
                }
                if (answers.length === 0) {
                    return interaction.reply({ content: "❌ لم يتم العثور على بيانات متطابقة.", ephemeral: true });
                }
                const selectMenu = new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("poll")
                    .setPlaceholder("اختر الأمر!");
                answers.forEach((commandName) => {
                    selectMenu.addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel(commandName)
                        .setValue(`select_${commandName}`));
                });
                const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
                yield interaction.reply({ content: "تم إعداد التصويت بنجاح!", ephemeral: true });
                const message = yield interaction.channel.send({
                    content: `🔹 **${title}**\nيرجى اختيار أمر من القائمة أدناه.`,
                    components: [row],
                });
                const collector = message.createMessageComponentCollector({
                    componentType: discord_js_1.ComponentType.StringSelect,
                    time: (0, ms_1.default)(time),
                });
                const votes = new Map();
                this.client.polls.set(message.id, votes);
                collector.on("collect", (selectInteraction) => __awaiter(this, void 0, void 0, function* () {
                    const userId = selectInteraction.user.id;
                    if (votes.has(userId)) {
                        return selectInteraction.reply({ content: "❌ لقد قمت بالتصويت بالفعل!", ephemeral: true });
                    }
                    const selectedValue = selectInteraction.values[0].replace("select_", "");
                    votes.set(userId, selectedValue);
                    let finalResults = `🛑 **نتائج التصويت:**\n`;
                    const finalCounts = {};
                    votes.forEach((value) => {
                        finalCounts[value] = (finalCounts[value] || 0) + 1;
                    });
                    // تحديث النتائج
                    for (const [command, count] of Object.entries(finalCounts)) {
                        finalResults += `🔹 **${command}**: ${count} تصويت\n`;
                    }
                    yield selectInteraction.reply({
                        content: `✅ تم تسجيل تصويتك لـ **${selectedValue}**`,
                        ephemeral: true,
                    });
                    yield message.edit({
                        content: finalResults,
                    });
                }));
                collector.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let finalResults = "🛑 **انتهى التصويت! النتائج النهائية:**\n";
                    const finalCounts = {};
                    votes.forEach((value) => {
                        finalCounts[value] = (finalCounts[value] || 0) + 1;
                    });
                    const sortedResults = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
                    sortedResults.forEach(([command, count]) => {
                        finalResults += `🔹 **${command}**: ${count} تصويت\n`;
                    });
                    finalResults += `-------------------\n🥇 **الفائز**: **${sortedResults[0][0]}** \\**${sortedResults[0][1]}** تصويت.`;
                    const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
                    yield message.edit({
                        content: `🛑 تم إيقاف التصويت. [رابط التصويت](https://discord.com/channels/${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}/${message.channel.id}/${message.id}).`,
                        components: [disabledRow],
                    });
                    yield message.reply({
                        content: finalResults,
                    });
                }));
            }
            else if (subCommand === 'stop') {
                const messageId = interaction.options.getString("messageid");
                if (!messageId) {
                    return interaction.reply({ content: "❌ يجب توفير معرف الرسالة.", ephemeral: true });
                }
                const message = yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.messages.fetch(messageId));
                if (!message) {
                    return interaction.reply({ content: "❌ لم أتمكن من العثور على الرسالة.", ephemeral: true });
                }
                const votes = this.client.polls.get(message.id);
                if (!votes) {
                    return interaction.reply({ content: "❌ لم أتمكن من العثور على بيانات التصويت.", ephemeral: true });
                }
                let finalResults = "🛑 **انتهى التصويت! النتائج النهائية:**\n";
                const finalCounts = {};
                votes.forEach((value) => {
                    finalCounts[value] = (finalCounts[value] || 0) + 1;
                });
                const sortedResults = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
                sortedResults.forEach(([command, count]) => {
                    finalResults += `🔹 **${command}**: ${count} تصويت\n`;
                });
                finalResults += `-------------------\n🥇 **الفائز**: **${sortedResults[0][0]}** \n**${sortedResults[0][1]} تصويت**.`;
                yield message.edit({
                    content: `🛑 تم إيقاف التصويت. [رابط التصويت](https://discord.com/channels/${(_c = message.guild) === null || _c === void 0 ? void 0 : _c.id}/${message.channel.id}/${message.id}).`,
                    components: [],
                });
                yield interaction.reply({
                    content: `${emojis_1.default.true} | تم بنجاح إيقاف التصويت`,
                    ephemeral: true
                });
            }
        });
    }
}
exports.default = Test;
