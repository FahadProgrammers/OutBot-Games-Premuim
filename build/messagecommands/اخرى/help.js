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
class help extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "help",
            description: "طلب مساعده",
            category: Category_1.default.ادمن,
            cooldown: 3,
            aliases: ["العاب", "مساعده", "مساعدة"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.guild) {
                const Embed = (0, BaseEmbed_1.default)(message.guild, {
                    title: "قائمة الاوامر",
                    des: `
      <:Picsart_241028_170653120:1303325780704759868> - **قائمة الاوامر**:

<:premuim:1341414399696703549>  يمكنك **الاختيار** من القائمه أدناه للحصول على **المطلوب**.

1 - <:0_:1341414321955278868> الالعاب الفرديه
2 - <:0_:1341414321955278868> الالعاب الثنائيه
3 - <:0_:1341414321955278868> الالعاب الجماعيه
4 - <:0_:1341414321955278868> اوامر السلاش
5 - <:all_2:1341693257062813746> الكل

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
                    yield message.reply({
                        embeds: [Embed],
                        components: [actionrow],
                    });
                }
            }
        });
    }
}
exports.default = help;
