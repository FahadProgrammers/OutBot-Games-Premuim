import {
  TextChannel,
  AutocompleteInteraction,
  Events,
  Role,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import schema_2 from "../../schema/SchemaEvent";

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

    if (interaction.commandName === "command") {
      if (!interaction.guild?.id) {
        return;
      }

      const focusedValue = interaction.options.getFocused(true);
      const commands = this.client.messagecommands;

      if (focusedValue.name === "command") {
        const commandsWithFound1 = await schema_2.find({
          guildId: interaction.guild.id,
          channelId: interaction.channel?.id,
        });

        if (!commandsWithFound1) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }
      } else if (focusedValue.name === "select") {
        const commandsWithFound1 = await schema_2.find({
          guildId: interaction.guild.id,
        });

        if (!commandsWithFound1) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }

        const channelNames = await Promise.all(
          commandsWithFound1.map(async (data) => {
            const channel = this.client.channels.cache.get(data.channelId);
            if (channel instanceof TextChannel) {
              return { name: "#" + channel.name, value: data.channelId };
            }
            return null;
          })
        );

        const validChannelNames = channelNames.filter(
          (channel) => channel !== null
        ) as { name: string; value: string }[];

        const roleNames = await Promise.all(
          commandsWithFound1.map(async (data) => {
            const guild = await this.client.guilds.cache.get(data.guildId);
            const role = await guild?.roles.cache.get(data.roleId);
            if (role instanceof Role) {
              return { name: role.name, value: role.id };
            }
            return null;
          })
        );

        const validRoleNames = roleNames.filter((role) => role !== null) as {
          name: string;
          value: string;
        }[];

        const commandsWithFound = commandsWithFound1.map((data) => ({
          name: data.command,
          value: data.command,
        }));

        const respond = await Promise.all(
          commandsWithFound1.map(async (data) => {
            const guild = await this.client.guilds.cache.get(data.guildId);
            const channel = await this.client.channels.cache.get(
              data.channelId
            );
            const role = await guild?.roles.cache.get(data.roleId);
            const command = data.command;
            if (channel instanceof TextChannel) {
              return {
                name: `#${channel.name}, ${role?.name}, ${command}`,
                value: `${channel.id}_${role?.id}_${command}`,
              };
            }
          })
        );

        const validSelectNames = respond.filter((role) => role !== null) as {
          name: string;
          value: string;
        }[];

        await interaction.respond(validSelectNames);
      }
    }
  }
}
