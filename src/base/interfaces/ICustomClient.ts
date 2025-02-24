import { Collection } from "discord.js";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface ICustomClient {
commands: Collection<string, Command>;
subcommands: Collection<string, SubCommand>;
colldowns: Collection<string, Collection<string, number>>;
devlopmentMode: boolean;

start(): void;
LoadEvents(): void;
}