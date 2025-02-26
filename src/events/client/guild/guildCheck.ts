import {
  bold,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
  Guild,
  TextChannel,
  time,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import Command from "../../../base/classes/MessageCreate";
import schema_1 from "../../../schema/SchemaPrefix";

export default class GuildCheckCommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildCreate,
      description: "Command GuildCheck",
      once: false,
    });
  }
  async execute(guild: Guild) {
    const find = await schema_1.findOne({
      guildId: guild?.id,
    });

    if (find) {
      if (guild.id !== find.guildId) {
        await guild.leave();
      }
    } else {
      if (guild.id !== process.env.guildId) {
        await guild.leave();
      }
    }
  }
}
