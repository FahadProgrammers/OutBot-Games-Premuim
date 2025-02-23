"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    p: { type: Number, required: true }
});
exports.default = (0, mongoose_1.model)("Profile-Tester", schema2);
