"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: String,
    channelId: String,
    roleId: { type: String, require: false },
    count: { type: Number, require: false, default: 0 },
});
exports.default = (0, mongoose_1.model)("counter-prem", schema2);
