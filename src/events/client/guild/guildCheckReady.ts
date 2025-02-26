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
import schema_1 from "../../../schema/SchemaPremuim";

export default class GuildCheckCommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Command GuildCheck",
      once: false,
    });
  }
  async execute(client: CustomClient) {
    client.guilds.cache.forEach(async (guild) => {
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
    });
  }
}
