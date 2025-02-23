"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageCommand {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.cooldown = options.cooldown;
        this.aliases = options.aliases;
    }
    execute(message) {
    }
    AutoComplete(message) {
    }
}
exports.default = MessageCommand;
