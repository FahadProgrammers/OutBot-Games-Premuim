"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomClient_1 = __importDefault(require("./base/classes/CustomClient"));
const DataBase_1 = __importDefault(require("./base/classes/DataBase"));
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
