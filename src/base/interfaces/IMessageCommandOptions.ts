import { SlashCommandBuilder } from "discord.js";
import category from "../enums/Category";

export default interface IMessageCommandOptions {
    name: string;
    description: string;
    category: category;
    cooldown: number;
    aliases: string[];
}