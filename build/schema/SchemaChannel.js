"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: String,
    channelId: Array,
    date: { type: Date, default: Date.now() },
    dateend: { type: Date, default: Date.now(), required: false }
});
exports.default = (0, mongoose_1.model)("channel-Tester", schema2);
