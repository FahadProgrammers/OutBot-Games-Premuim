import { SlashCommandBuilder } from "discord.js";
import category from "../enums/Category";

export default interface IMessageCreate {
    name: string;
    description: string;
    category: category;
    default_member_permissions: bigint;
    dm_permission: boolean;
    cooldown: number;
}