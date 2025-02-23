"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    botId: { type: String, required: true },
    token: { type: String, required: true },
    own: { type: Boolean, required: true }
});
exports.default = (0, mongoose_1.model)("PremuimBots", schema2);
