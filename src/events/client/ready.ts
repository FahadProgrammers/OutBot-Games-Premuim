import { Activity, Collection, Events, REST, Routes } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import Command from "../../base/classes/Command";
import colors from "colors";
import Category from "../../base/enums/Category";

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "LOG EVENT",
      once: true,
    });
  }

  async execute() {
    try {
    console.log(
      colors.underline(`${this.client.user?.username}`).gray + " Online!"
    );
    const Activitys = [
      "OutBot Games!",
      "Play Now!",
      "إلعب الان",
      "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِين",
      "لاتخلي اللعب يلهيك عن الصلاه"
    ];

    setInterval(() => {
      const active = Activitys[Math.floor(Math.random() * Activitys.length)];
    this.client.user?.setActivity(active);
    }, 10000);
    
    this.client.user?.setStatus("dnd");
    const clientId = this.client.devlopmentMode
      ? this.client.config.devclientId
      : this.client.config.clientId;
    const guildId = this.client.devlopmentMode
      ? this.client.config.devguildId
      : this.client.config.guildId;
    const token = this.client.devlopmentMode
      ? this.client.config.devtoken
      : this.client.config.token;

    const commands = JSON.parse(
      JSON.stringify(this.GetJson(this.client.commands))
    );
    const commandsDev = JSON.parse(
      JSON.stringify(this.GetJsonDev(this.client.commands))
    );
    const rest = new REST().setToken(token);

    const setCommands: any = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    const setCommandsDev: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandsDev }
    );

    console.log(
      colors.green("[REST API] ") +
        `Successfully SetUp ${setCommands.length} SlashCommands and ${setCommandsDev.length} Dev Command </> `
    );
  } catch(err) { 
    console.log(err)
  }
}

  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = [];
    commands.forEach((command) => {
      if (command.category === Category.Dev) return;
      data.push(command.data.toJSON());
    });
    return data;
  }

  private GetJsonDev(commands: Collection<string, Command>): object[] {
    const data: object[] = [];
    commands.forEach((command) => {
      if (command.category === Category.Dev) {
        data.push(command.data.toJSON());
      }
    });
    return data;
  }
}
