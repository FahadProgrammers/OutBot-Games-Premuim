import { AutocompleteInteraction, Message, Events } from "discord.js";
import IMessageCommand from "../interfaces/IMessageCommand";
import CustomClient from "./CustomClient";
import IMessageCreateOPtions from "../interfaces/IMessageCommandOptions";
import category from '../enums/Category';

export default class MessageCommand implements IMessageCommand {
    client: CustomClient;
    name: string;
    description: string;
    category: category;
    cooldown: number;
    aliases: string[];
    constructor(client:CustomClient, options: IMessageCreateOPtions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.cooldown = options.cooldown;
        this.aliases = options.aliases;
    }
    execute(message: Message): void {
    }
    AutoComplete(message: Message): void {
    }

}