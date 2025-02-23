"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mainembed;
const discord_js_1 = require("discord.js");
function mainembed(des) {
    return new discord_js_1.EmbedBuilder()
        .setDescription(des)
        .setColor('Red');
}
