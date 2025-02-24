"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true },
    statsall: { type: Number, required: true, default: 0 },
    commands: { type: Map, of: Number, default: {} }
});
exports.default = (0, mongoose_1.model)("ServerUsedStats", schema2);
