"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }
    execute(...args) { }
    ;
}
exports.default = Event;
