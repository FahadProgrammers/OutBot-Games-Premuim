"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("./Handler"));
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildPresences
            ],
        });
        this.config = require(`${process.cwd()}/src/data/config.json`);
        this.polls = new Map(); // Initialize the polls map
        this.handler = new Handler_1.default(this);
        this.commands = new discord_js_1.Collection();
        this.subcommands = new discord_js_1.Collection();
        this.colldowns = new discord_js_1.Collection();
        this.devlopmentMode = process.argv.slice(2).includes("--devlopment");
        this.messagecommands = new discord_js_1.Collection();
        this.messagecommandshorts = new discord_js_1.Collection();
    }
    start() {
        console.log(`Mode of the Bot : ${this.devlopmentMode ? "Dev" : "Globaly"} Mode.`);
        this.LoadEvents();
        this.login(this.config.token).catch((err) => console.log(err));
    }
    LoadEvents() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
        this.handler.LoadMessageCommands();
    }
}
exports.default = CustomClient;
