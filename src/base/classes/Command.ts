import { ChatInputCommandInteraction, AutocompleteInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import category from '../enums/Category';
import ICommand from '../interfaces/ICommand'; 
import CustomClient from './CustomClient';
import ICommandOptions from '../interfaces/ICommandsOptions';

export default class Command implements ICommand {
    client: CustomClient;
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder
    category: category;
    cooldown: number;

    constructor(client: CustomClient, options: ICommandOptions) {
        this.client = client;
        this.category = options.category;
        this.cooldown = options.cooldown;
        this.data = options.data;
    }

    execute(interaction: ChatInputCommandInteraction): void {

    }

    AutoComplete(interaction: AutocompleteInteraction): void {

    }
}