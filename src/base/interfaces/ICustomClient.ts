import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface ICustomClient {
config: IConfig;
commands: Collection<string, Command>;
subcommands: Collection<string, SubCommand>;
colldowns: Collection<string, Collection<string, number>>;
devlopmentMode: boolean;

start(): void;
LoadEvents(): void;
}