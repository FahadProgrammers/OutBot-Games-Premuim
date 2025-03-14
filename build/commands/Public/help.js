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
const BaseEmbed_1 = __importDefault(require("../../utils/embeds/BaseEmbed"));
class help extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("help")
                .setDescription("معرفة الاوامر المخصصه."),
            category: Category_1.default.ادمن,
            cooldown: 0,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield interaction.deferReply({
                ephemeral: true,
            });
            if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                return interaction.editReply({
                    content: `${emojis_1.default.false} | ?`,
                });
            }
            const Embed = yield (0, BaseEmbed_1.default)(this.client, interaction.guild, {
                title: "قائمة الاوامر",
                des: `
      <:Picsart_241028_170653120:1303325780704759868> - **قائمة الاوامر**:

<:premuim:1341414399696703549>  يمكنك **الاختيار** من القائمه أدناه للحصول على **المطلوب**.

1 - ${emojis_1.default.esar_arrow} الالعاب الفرديه
2 - ${emojis_1.default.esar_arrow} الالعاب الثنائيه
3 - ${emojis_1.default.esar_arrow} الالعاب الجماعيه
4 - ${emojis_1.default.esar_arrow} اوامر السلاش
5 - ${emojis_1.default.all} الكل

`,
                line: true,
                footer: "Help Menu",
                fields: "Help Menu",
            }, "Base");
            const actionrow = new discord_js_1.ActionRowBuilder();
            const selectMenu = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId("starter")
                .setPlaceholder("قائمة الاوامر");
            Object.keys(Category_1.default).forEach((key) => {
                if (key === Category_1.default.Dev)
                    return;
                let name;
                if (key === "فرديه") {
                    name = "الألعاب الفرديه";
                }
                else if (key === "ثنائيه") {
                    name = "الألعاب الثنائيه";
                }
                else if (key === "مجموعه") {
                    name = "الألعاب الجماعيه";
                }
                else if (key === "ادمن") {
                    name = "اوامر السلاش";
                }
                else {
                    name = "حدث خطأ";
                }
                ;
                if (name) {
                    selectMenu.addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel(name)
                        .setValue(key)
                        .setEmoji("<:Picsart_241028_170653120:1303325780704759868>"));
                }
            });
            selectMenu.addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("الكل")
                .setValue("all")
                .setEmoji("<:all_2:1341693257062813746>"));
            actionrow.addComponents(selectMenu);
            if (Embed) {
                yield interaction.editReply({
                    embeds: [Embed],
                    components: [actionrow],
                });
            }
        });
    }
}
exports.default = help;
