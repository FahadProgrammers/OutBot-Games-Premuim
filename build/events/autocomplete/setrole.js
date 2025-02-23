"use strict";
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
const Category_1 = __importDefault(require("../../base/enums/Category"));
class CommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Command Handler Event",
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!interaction.isAutocomplete())
                return;
            if (interaction.commandName === "setrole") {
                if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id)) {
                    return;
                }
                const focusedValue = interaction.options.getFocused(true);
                const commands = this.client.messagecommands;
                if (focusedValue.name === "command") {
                    if (!commands) {
                        yield interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
                        return;
                    }
                    const commandsWithFound = commands.filter((command) => command.category !== Category_1.default.ادمن);
                    yield interaction.respond([
                        {
                            name: "جميع الأوامر",
                            value: "all",
                        },
                        {
                            name: "اوامر فرديه",
                            value: "one",
                        },
                        {
                            name: "اوامر ثنائيه",
                            value: "two",
                        },
                        ...commandsWithFound.map((command) => ({
                            name: `${command.name}`,
                            value: `${command.name}`,
                        })),
                    ]);
                }
            }
        });
    }
}
exports.default = CommandHandler;
