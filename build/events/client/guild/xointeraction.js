"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Events_1 = __importDefault(require("../../../base/classes/Events"));
class MessageCommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Command Handler MessageCreate",
            once: false,
        });
    }
    execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId.startsWith("button_")) {
                const [, id] = interaction.customId.split("_");
                const data = [];
                interaction.update({
                    components: [
                        new discord_js_1.ActionRowBuilder().addComponents(interaction.message.components
                            .map((row1) => {
                            const row = row1.components.some((row) => { var _a; return (_a = row.customId) === null || _a === void 0 ? void 0 : _a.includes(`_${id}`); });
                            const rowf = row1.components.find((row) => { var _a; return (_a = row.customId) === null || _a === void 0 ? void 0 : _a.includes(`_${id}`); });
                            if (row && rowf) {
                                return discord_js_1.ButtonBuilder.from(rowf).setDisabled(true); // Return the modified ButtonBuilder
                            }
                            return null;
                        })
                            .filter((button) => button !== null) // Filter out null values and cast to ButtonBuilder[]
                        ),
                    ],
                });
            }
        }
    }
}
exports.default = MessageCommandHandler;
