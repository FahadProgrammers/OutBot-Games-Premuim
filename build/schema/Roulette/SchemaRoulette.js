"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema2 = new mongoose_1.Schema({
    guildId: String,
    channelId: String,
    dobule: {
        type: mongoose_1.Schema.Types.Boolean,
        require: false,
    },
    dobuleUsed: {
        type: mongoose_1.Schema.Types.Boolean,
        require: false,
    },
    players: [
        {
            winner: {
                type: mongoose_1.Schema.Types.String,
                require: false,
            },
            security: {
                type: mongoose_1.Schema.Types.Boolean,
                require: false,
            },
            securityUsed: {
                type: mongoose_1.Schema.Types.Boolean,
                require: false,
            },
            cancel: {
                type: mongoose_1.Schema.Types.Boolean,
                require: false,
            },
            cancelUsed: {
                type: mongoose_1.Schema.Types.Boolean,
                require: false,
            },
            user: {
                type: mongoose_1.Schema.Types.Mixed,
                require: true /* unique: true */,
            },
            username: {
                type: mongoose_1.Schema.Types.String,
                require: true,
            },
            userId: {
                type: mongoose_1.Schema.Types.String,
                require: true,
            },
            number: {
                type: mongoose_1.Schema.Types.Number,
                require: true,
            },
            image: {
                type: mongoose_1.Schema.Types.String,
                require: true,
            },
        },
    ],
    msgId: String,
});
exports.default = (0, mongoose_1.model)("roulette-prem", schema2);
