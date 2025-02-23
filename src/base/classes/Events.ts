import { Events } from "discord.js";
import IEvent from "../interfaces/IEvent";
import CustomClient from "./CustomClient";
import IEventOPtions from "../interfaces/IEventOptions";

export default class Event implements IEvent {
    client: CustomClient;
    name: Events;
    description: string;
    once: boolean;
    
    constructor(client:CustomClient, options: IEventOPtions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    execute(...args: any): void {};
}