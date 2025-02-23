"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, options) {
        this.client = client;
        this.category = options.category;
        this.cooldown = options.cooldown;
        this.data = options.data;
    }
    execute(interaction) {
    }
    AutoComplete(interaction) {
    }
}
exports.default = Command;
