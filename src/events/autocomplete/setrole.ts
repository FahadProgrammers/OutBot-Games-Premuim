import {
  AutocompleteInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import Command from "../../base/classes/Command";
import mainembedWithUser from "../../utils/embeds/mainembedWithUser";
import mainembed from "../../utils/embeds/mainEmbed";
import schema_2 from "../../schema/SchemaPrefix";
import prefix from "../../schema/SchemaPrefix";
import Category from "../../base/enums/Category";

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

    if (interaction.commandName === "setrole") {
      if (!interaction.guild?.id) {
        return;
      }

      const focusedValue = interaction.options.getFocused(true);
      const commands = this.client.messagecommands;

      if (focusedValue.name === "command") {
        if (!commands) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }

        const commandsWithFound = commands.filter(
          (command) => command.category !== Category.ادمن
        );

        await interaction.respond([
          {
            name: "جميع الأوامر",
            value: "all",
          },
          {
            name: "اوامر فرديه",
            value: "one",
          },
          {
            name: "اوامر ثنائيه",
            value: "two",
          },
          ...commandsWithFound.map((command) => ({
            name: `${command.name}`,
            value: `${command.name}`,
          })),
        ]);
      }
    }
  }
}
