import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import Command from "../../../base/classes/Command";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      const command: Command = this.client.commands.get(
        interaction.commandName
      )!;
      //@ts-ignore
      if (!command.data.name)
        return (
          (await interaction.reply({
            content: "This command does not exist!",
            ephemeral: true,
          })) && this.client.commands.delete(interaction.commandName)
        );

      const { colldowns } = this.client;

      if (!colldowns.has(command.data.name)) {
        colldowns.set(command.data.name, new Collection());
      }
      const now = Date.now();
      const timestamps = colldowns.get(command.data.name)!;
      const colldownAmount = (command.cooldown || 3) * 1000;

      if (
        timestamps.has(interaction.user.id) &&
        now < timestamps.get(interaction.user.id)! + colldownAmount
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `❌ Please wait another \`${(
                  (timestamps.get(interaction.user.id)! +
                    colldownAmount -
                    now) /
                  1000
                ).toFixed(1)} \` seconds to run command`
              ),
          ],
          ephemeral: true,
        });

      timestamps.set(interaction.user.id, now);

      setTimeout(() => timestamps.delete(interaction.user.id), colldownAmount);
      return command.execute(interaction);
    } catch (err) {
      console.log(err);
    }
  }
}
