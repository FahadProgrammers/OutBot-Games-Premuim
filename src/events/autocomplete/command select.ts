import {
  AutocompleteInteraction,
  Events,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import Command from "../../base/classes/Command";
import schema_2 from "../../schema/SchemaPrefix";
import prefix from "../../schema/SchemaPrefix";
import Category from "../../base/enums/Category";
import SchemaControl from "../../schema/SchemaCommandControl";

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
      if (focusedValue.name === "command-select") {
        if (!commands) {
          await interaction.respond([{ name: "لا توجد نتائج 🙄", value: "" }]);
          return;
        }

        const commandsWithFound = commands.filter(
          (command) => command.category !== Category.ادمن
        );

        const filtered = commandsWithFound
        .filter((data) => data.name.toLowerCase().startsWith(focusedValue.value.toLowerCase()))
        .sort((a, b) => {
          const aExact = a.name.toLowerCase() === focusedValue.value.toLowerCase();
          const bExact = b.name.toLowerCase() === focusedValue.value.toLowerCase();
      
          if (aExact && !bExact) return -1; // وضع التطابق الكامل في المقدمة
          if (!aExact && bExact) return 1;
          return a.name.localeCompare(b.name); // ترتيب أبجدي لبقية العناصر
        });
               const ddfind = await SchemaControl.findOne({
                 guildId: interaction.guildId,
               });      
               let content = await ddfind?.command.map((data) => {
                if(data === "all") {
                  return "جميع الاوامر"
                } else if(data === "one") {
                  return "الاوامر الفرديه"
                } else if(data === 'two') {
                  return "الاوامر الثنائيه"
                } else  if(data === "three") {
                  return "اوامر المجموعه"
                } else {
                  return data;
                }
              });       
    await interaction.respond([
      {
        name: `الأوامر المُعطله: [${content?.join(',') || "لايوجد"}]`,
        value: ""
      },
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
          {
            name: "اوامر المجموعه",
            value: "three",
          },
          ...filtered.map((command) => ({
            name: `${command.name}`,
            value: `${command.name}`,
          })).slice(0, 25),
        ]);
      }
    }
  }
}
