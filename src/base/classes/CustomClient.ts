import * as dotenv from "dotenv";
dotenv.config();

import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import MessageCommands from "./MessageCreate";
import SchemaPremuimBots from "../../schema/SchemaPremuimBots";
import colors from "colors";
import Category from "../enums/Category";

export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  commands: Collection<string, Command>;
  subcommands: Collection<string, SubCommand>;
  colldowns: Collection<string, Collection<string, number>>;
  devlopmentMode: boolean;
  messagecommands: Collection<string, MessageCommands>;
  messagecommandshorts: Collection<string, MessageCommands>;
  polls: Map<string, Map<string, string>>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    this.setMaxListeners(0);
    this.polls = new Map();
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subcommands = new Collection();
    this.colldowns = new Collection();
    this.devlopmentMode = process.argv.includes("--devlopment");
    this.messagecommands = new Collection();
    this.messagecommandshorts = new Collection();
  }

  async start(): Promise<void> {
    const bots = await SchemaPremuimBots.find();

    if (bots.length === 0) {
      console.log("لا توجد بيانات بوتات في قاعدة البيانات.");
      return;
    }


   
   for (const bot of bots) {
  if (bot) {
    const client = new CustomClient(); // إنشاء كائن منفصل لكل بوت

    try {
      await client.startBot(bot);
      console.log(`✅ Bot ${bot.botId} setup completed!`);
    } catch (err) {
      console.error(`❌ Bot ${bot.botId} encountered an error:`, err);
    }
  }
}

  }

private async startBot(bot: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await this.login(bot.token); // تسجيل الدخول وانتظاره

      await this.LoadEvents(); // تحميل الأحداث بعد تسجيل الدخول
      this.setupBot(); // إعداد النشاط

      // انتظار انتهاء تسجيل الأوامر قبل الانتقال للبوت التالي
      await this.registerCommands();

      resolve(); // استكمال العملية والانتقال للبوت التالي
    } catch (error) {
      reject(error); // التعامل مع الأخطاء
    }
  });
}

  private setupBot(): void {
    if (!this.user) return;

    const Activitys = [
      "OutBot Games!",
      "Play Now!",
      "إلعب الان",
      "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِين",
      "لاتخلي اللعب يلهيك عن الصلاه"
    ];

    setInterval(() => {
      const active = Activitys[Math.floor(Math.random() * Activitys.length)];
      this.user?.setActivity(active);
    }, 10000);

    this.user?.setStatus("dnd");

  }

  private async registerCommands(): Promise<void> {
    if (!this.user) return;

    const clientId = this.user.id;
    const guildId = process.env.guildId;

    if (!clientId || !guildId) {
      console.error("Client ID or Guild ID is not defined");
      return;
    }

    const data = await SchemaPremuimBots.findOne({ botId: clientId });
    if (!data?.token) {
      console.error("Token is not defined");
      return;
    }

    const commands = this.commands.size > 0 ? JSON.parse(JSON.stringify(this.GetJson(this.commands))) : [];
    const commandsDev = this.commands.size > 0 ? JSON.parse(JSON.stringify(this.GetJsonDev(this.commands))) : [];

    const rest = new REST().setToken(data.token);

    try {
      const setCommands: any = await rest.put(Routes.applicationCommands(clientId), { body: commands });
      const setCommandsDev: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsDev });
    } catch (error) {
      console.error("Failed to register commands:", error);
    }
  }

  private GetJson(commands: Collection<string, Command>): object[] {
    return [...commands.values()]
      .filter((command) => command.category !== Category.Dev)
      .map((command) => command.data.toJSON());
  }

  private GetJsonDev(commands: Collection<string, Command>): object[] {
    return [...commands.values()]
      .filter((command) => command.category === Category.Dev)
      .map((command) => command.data.toJSON());
  }

  LoadEvents(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
    this.handler.LoadMessageCommands();
  }
}
