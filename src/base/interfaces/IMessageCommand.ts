import { AutocompleteInteraction, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import CustomClient from "../classes/CustomClient";
import Category from "../enums/Category";

export default interface IMessageCommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    cooldown: number;
    aliases: string[];
    execute(message: Message): void;    
}