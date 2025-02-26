import {
  TextChannel,
  AutocompleteInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import Command from "../../base/classes/Command";
import schema_2 from "../../schema/SchemaCounter";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName === "counter") {
      if (!interaction.guild?.id) {
        return;
      }

      const focusedValue = interaction.options.getFocused(true);

      if (focusedValue.name === "remove") {
        const schema_1 = await schema_2.find({
          guildId: interaction.guild.id,
        });
        const channels: string[] = schema_1?.map((doc) => doc.channelId) || [];

        const filtered = channels.filter((channelId) =>
          channelId.toLowerCase().startsWith(focusedValue.value.toLowerCase())
        );

        const channelNames = await Promise.all(
          filtered.map(async (channelId) => {
            const channel = this.client.channels.cache.get(channelId);
            if (channel instanceof TextChannel) {
              return { name: "#" + channel.name, value: channelId };
            }
            return null;
          })
        );
        if (filtered.length === 0) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }
        const validChannelNames = channelNames.filter(
          (channel) => channel !== null
        ) as { name: string; value: string }[];

        await interaction.respond(validChannelNames);
      }
    }
  }
}
