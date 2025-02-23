import { Events } from "discord.js";

export default interface IEventOPtions {
    name: Events;
    description: string;
    once: boolean;
}