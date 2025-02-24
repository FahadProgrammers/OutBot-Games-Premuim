import * as dotenv from "dotenv";

dotenv.config();
import { Client, Collection, GatewayIntentBits, TextChannel } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import messagecommands from "./MessageCreate";
import messagecommandshorts from "./MessageCreate";
export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  commands: Collection<string, Command>;
  subcommands: Collection<string, SubCommand>;
  colldowns: Collection<string, Collection<string, number>>;
  devlopmentMode: boolean;
  messagecommands: Collection<string, messagecommands>;
  messagecommandshorts!: Collection<string, messagecommandshorts>;
  polls: Map<string, Map<string, string>>;  // This will store the votes for each poll by message ID
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
      ],
    });
    this.polls = new Map(); 
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subcommands = new Collection();
    this.colldowns = new Collection();
    this.devlopmentMode = process.argv.slice(2).includes("--devlopment");
    this.messagecommands = new Collection();
    this.messagecommandshorts = new Collection();
  }
  start(): void {
    console.log(
      `Mode of the Bot : ${this.devlopmentMode ? "Dev" : "Globaly"} Mode.`
    );
    this.LoadEvents();

    this.login(
      process.env.token
    ).catch((err) => console.log(err));
    
  }

  LoadEvents(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
    this.handler.LoadMessageCommands();
  }
}
