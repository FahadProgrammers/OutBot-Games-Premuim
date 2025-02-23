import {
  ActionRow,
  ActionRowBuilder,
  APIButtonComponent,
  ButtonBuilder,
  ButtonInteraction,
  Events,
  MessageActionRowComponent,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";

export default class MessageCommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler MessageCreate",
      once: false,
    });
  }
  execute(interaction: ButtonInteraction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("button_")) {
        const [, id] = interaction.customId.split("_");
        const data: ActionRow<MessageActionRowComponent>[] = [];

        interaction.update({
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              interaction.message.components
                .map((row1) => {
                  const row = row1.components.some((row) =>
                    row.customId?.includes(`_${id}`)
                  );
                  const rowf = row1.components.find((row) =>
                    row.customId?.includes(`_${id}`)
                  ) as APIButtonComponent;
                  if (row && rowf) {
                    return ButtonBuilder.from(rowf).setDisabled(true); // Return the modified ButtonBuilder
                  }
                  return null;
                })
                .filter((button) => button !== null) as ButtonBuilder[] // Filter out null values and cast to ButtonBuilder[]
            ),
          ],
        });
      }
    }
  }
}
