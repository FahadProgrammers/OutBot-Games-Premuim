import {
  TextChannel,
  AutocompleteInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import schema_2 from "../../schema/SchemaPrefix";

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

    if (interaction.commandName === "prefix") {
      if (!interaction.guild?.id) {
        return;
      }

      const focusedValue = interaction.options.getFocused(true);

      if (focusedValue.name === "delprefix") {
        const schema_1 =
          (await schema_2.find({
            guildId: interaction.guild.id,
          })) || null;

        if (!schema_1) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }

        const responses = schema_1
          .map((data, index) => {
            if(typeof data.channelId === "string") {
            const channel = this.client.channels.cache.get(data?.channelId);
            if (channel instanceof TextChannel) {
              return {
                name: `البريفكس: [${
                  data.prefix.join(",") || "Unknown"
                }]\ القناه: #${channel.name}`,
                value: `${data.prefix || "Unknown"}_${data.channelId}`,
              };
            }
            return null; 
          }
          })
          .filter(Boolean); 

        if (responses.length > 0) {
          const validSelectNames = responses.filter(
            (role) => role !== null
          ) as { name: string; value: string }[];

          await interaction.respond(validSelectNames);
        } else {
          await interaction.respond([
            { name: "لا توجد بادئات صالحة 🙄", value: "" },
          ]);
        }
      }
    }
  }
}
