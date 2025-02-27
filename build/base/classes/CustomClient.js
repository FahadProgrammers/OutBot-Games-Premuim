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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("./Handler"));
const SchemaPremuimBots_1 = __importDefault(require("../../schema/SchemaPremuimBots"));
const Category_1 = __importDefault(require("../enums/Category"));
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMembers,
            ],
        });
        this.setMaxListeners(0);
        this.polls = new Map();
        this.handler = new Handler_1.default(this);
        this.commands = new discord_js_1.Collection();
        this.subcommands = new discord_js_1.Collection();
        this.colldowns = new discord_js_1.Collection();
        this.devlopmentMode = process.argv.includes("--devlopment");
        this.messagecommands = new discord_js_1.Collection();
        this.messagecommandshorts = new discord_js_1.Collection();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const bots = yield SchemaPremuimBots_1.default.find();
            if (bots.length === 0) {
                console.log("لا توجد بيانات بوتات في قاعدة البيانات.");
                return;
            }
            for (const bot of bots) {
                if (bot) {
                    const client = new CustomClient(); // إنشاء كائن منفصل لكل بوت
                    try {
                        yield client.startBot(bot);
                        console.log(`✅ Bot ${bot.botId} setup completed!`);
                    }
                    catch (err) {
                        console.error(`❌ Bot ${bot.botId} encountered an error:`, err);
                    }
                }
            }
        });
    }
    startBot(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.login(bot.token); // تسجيل الدخول وانتظاره
                    yield this.LoadEvents(); // تحميل الأحداث بعد تسجيل الدخول
                    this.setupBot(); // إعداد النشاط
                    // انتظار انتهاء تسجيل الأوامر قبل الانتقال للبوت التالي
                    yield this.registerCommands();
                    resolve(); // استكمال العملية والانتقال للبوت التالي
                }
                catch (error) {
                    reject(error); // التعامل مع الأخطاء
                }
            }));
        });
    }
    setupBot() {
        var _a;
        if (!this.user)
            return;
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
            (_a = this.user) === null || _a === void 0 ? void 0 : _a.setActivity(active);
        }, 10000);
        (_a = this.user) === null || _a === void 0 ? void 0 : _a.setStatus("dnd");
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.user)
                return;
            const clientId = this.user.id;
            const guildId = process.env.guildId;
            if (!clientId || !guildId) {
                console.error("Client ID or Guild ID is not defined");
                return;
            }
            const data = yield SchemaPremuimBots_1.default.findOne({ botId: clientId });
            if (!(data === null || data === void 0 ? void 0 : data.token)) {
                console.error("Token is not defined");
                return;
            }
            const commands = this.commands.size > 0 ? JSON.parse(JSON.stringify(this.GetJson(this.commands))) : [];
            const commandsDev = this.commands.size > 0 ? JSON.parse(JSON.stringify(this.GetJsonDev(this.commands))) : [];
            const rest = new discord_js_1.REST().setToken(data.token);
            try {
                const setCommands = yield rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
                const setCommandsDev = yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildId), { body: commandsDev });
            }
            catch (error) {
                console.error("Failed to register commands:", error);
            }
        });
    }
    GetJson(commands) {
        return [...commands.values()]
            .filter((command) => command.category !== Category_1.default.Dev)
            .map((command) => command.data.toJSON());
    }
    GetJsonDev(commands) {
        return [...commands.values()]
            .filter((command) => command.category === Category_1.default.Dev)
            .map((command) => command.data.toJSON());
    }
    LoadEvents() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
        this.handler.LoadMessageCommands();
    }
}
exports.default = CustomClient;
