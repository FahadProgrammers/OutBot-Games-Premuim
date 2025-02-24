"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Events_1 = __importDefault(require("../../base/classes/Events"));
const colors_1 = __importDefault(require("colors"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class Ready extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.ClientReady,
            description: "LOG EVENT",
            once: true,
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log(colors_1.default.underline(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username}`).gray + " Online!");
                const Activitys = [
                    "OutBot Games!",
                    "Play Now!",
                    "إلعب الان",
                    "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِين",
                    "لاتخلي اللعب يلهيك عن الصلاه"
                ];
                setInterval(() => {
                    var _a;
                    const active = Activitys[Math.floor(Math.random() * Activitys.length)];
                    (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity(active);
                }, 10000);
                (_b = this.client.user) === null || _b === void 0 ? void 0 : _b.setStatus("dnd");
                const clientId = this.client.devlopmentMode
                    ? process.env.devclientId
                    : process.env.clientId;
                const guildId = this.client.devlopmentMode
                    ? process.env.devguildId
                    : process.env.guildId;
                if (!clientId || !guildId) {
                    throw new Error("Client ID or Guild ID is not defined");
                }
                const token = this.client.devlopmentMode
                    ? process.env.devtoken
                    : process.env.token;
                const commands = JSON.parse(JSON.stringify(this.GetJson(this.client.commands)));
                const commandsDev = JSON.parse(JSON.stringify(this.GetJsonDev(this.client.commands)));
                if (!token) {
                    throw new Error("Token is not defined");
                }
                const rest = new discord_js_1.REST().setToken(token);
                const setCommands = yield rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
                const setCommandsDev = yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildId), { body: commandsDev });
                console.log(colors_1.default.green("[REST API] ") +
                    `Successfully SetUp ${setCommands.length} SlashCommands and ${setCommandsDev.length} Dev Command </> `);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    GetJson(commands) {
        const data = [];
        commands.forEach((command) => {
            if (command.category === Category_1.default.Dev)
                return;
            data.push(command.data.toJSON());
        });
        return data;
    }
    GetJsonDev(commands) {
        const data = [];
        commands.forEach((command) => {
            if (command.category === Category_1.default.Dev) {
                data.push(command.data.toJSON());
            }
        });
        return data;
    }
}
exports.default = Ready;
