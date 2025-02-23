import IHandler from "../interfaces/IHandler";
import path from "path";
import { glob } from "glob";
import CustomClient from "./CustomClient";
import Event from "./Events";
import SubCommand from "./SubCommand";
import Command from "./Command";
import Command2 from "./MessageCreate";
export default class Handler implements IHandler {
  client: CustomClient;
  constructor(client: CustomClient) {
    this.client = client;
  }
  async LoadEvents() {
    const files = (await glob("build/events/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file: string) => {
      const event: Event = new (await import(file)).default(this.client);

      if (!event.name)
        return (
          delete require.cache[require.resolve(file)] &&
          console.log(`[Error] ${file.split("/").pop()}  Not Have Name!`)
        );

      const execute = (...args: any) => event.execute(...args);

      //@ts-ignore
      if (event.once) this.client.once(event.name, execute);
      //@ts-ignore
      else this.client.on(event.name, execute);

      return delete require.cache[require.resolve(file)];
    });
  }

  async LoadCommands() {
    const files = (await glob("build/commands/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file: string) => {
      const module = await import(file);

      const command: Command = new module.default(
        this.client
      );


      this.client.commands.set(command.data.name, command as Command);
      return delete require.cache[require.resolve(file)];
    });
  }

  async LoadMessageCommands() {
    const files = (await glob("build/messagecommands/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file: string) => {
      const module = await import(file);

      const command: Command2 = new module.default(
        this.client
      );

      this.client.messagecommands.set(command.name, command as Command2);
      command.aliases.forEach(alias => {
        this.client.messagecommandshorts.set(alias, command as Command2);
      });

    });
  }
//  
}
