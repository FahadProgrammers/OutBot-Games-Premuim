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
const CustomClient_1 = __importDefault(require("./base/classes/CustomClient"));
const DataBase_1 = __importDefault(require("./base/classes/DataBase"));
const openai_1 = __importDefault(require("openai"));
const client = new CustomClient_1.default();
client.start();
new DataBase_1.default().connect(client);
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});
process.on("uncaughtExceptionMonitor", (error) => {
    console.error("Uncaught Exception Monitor:", error);
});
function AIAnswer(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: client.config.API_KEY,
        });
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: question }],
            });
            // console.log(response.choices[0].message.content);
            if (response.choices[0].message.content) {
                return yield response.choices[0].message.content.toLowerCase().trim();
            }
        }
        catch (error) {
            console.error("Error making request to OpenAI:", error.message);
            throw error;
        }
    });
}
exports.default = AIAnswer;
