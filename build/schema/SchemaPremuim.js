"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    time: { type: Date, required: true },
    starttime: { type: Date, required: true },
    owner: { type: String, required: true },
    botId: { type: String, required: false },
    token: { type: String, required: false }
});
exports.default = (0, mongoose_1.model)("Premuim", schema2);
