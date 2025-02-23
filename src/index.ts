import { TextChannel } from "discord.js";
import CustomClient from "./base/classes/CustomClient"
import DataBase from "./base/classes/DataBase"
import { exec } from "node:child_process";
import cron from "node-cron";
import OpenAI from "openai";

const client = new CustomClient();

client.start();
new DataBase().connect(client);



process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
});
  
process.on("uncaughtExceptionMonitor", (error) => {
      console.error("Uncaught Exception Monitor:", error);
});
  



async function AIAnswer(question: string) {
    const openai = new OpenAI({
        apiKey: client.config.API_KEY,
      });      

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }],
    });
    // console.log(response.choices[0].message.content);
    if(response.choices[0].message.content) {
    return await response.choices[0].message.content.toLowerCase().trim();
  } 
} catch (error: any) {
    console.error("Error making request to OpenAI:", error.message);
    throw error;
  }
}


export default AIAnswer;