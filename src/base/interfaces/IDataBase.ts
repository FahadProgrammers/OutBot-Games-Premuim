import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";
import CustomClient from "../classes/CustomClient";
export default interface IDataBase {
connect(client: CustomClient): void;
}