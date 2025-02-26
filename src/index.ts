import { TextChannel } from "discord.js";
import CustomClient from "./base/classes/CustomClient"
import DataBase from "./base/classes/DataBase"

const client = new CustomClient();

client.start();
new DataBase().connect(client);




process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
      if(error.message === "Unknown interaction") return;
      console.error("Uncaught Exception:", error);
});
  
process.on("uncaughtExceptionMonitor", (error) => {
      if(error.message === "Unknown interaction") return;
      console.error("Uncaught Exception Monitor:", error);
});
  