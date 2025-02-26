"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: String,
    prefix: Array,
    channelId: { type: String, required: true },
    date: { type: Date, default: Date.now() },
});
exports.default = (0, mongoose_1.model)("prefix-prem", schema2);
