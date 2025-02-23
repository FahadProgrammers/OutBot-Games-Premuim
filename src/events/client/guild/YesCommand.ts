import {
    ButtonInteraction,
    Events,
    Message,
  } from "discord.js";
  import CustomClient from "../../../base/classes/CustomClient";
  import Event from "../../../base/classes/Events";
  import mainembed from "../../../utils/embeds/mainEmbed";
  
  export default class CommandHandler extends Event {
    constructor(client: CustomClient) {
      super(client, {
        name: Events.InteractionCreate,
        description: "Command Handler Event",
        once: false,
      });
    }
    async execute(interaction: ButtonInteraction) {
      if (!interaction.isButton()) return;
      if (interaction.customId.startsWith(`runcommand_`)) {
        const [, Command, MsgId] = interaction.customId.split("_");
      const command = this.client.messagecommands.get(Command);
      const message = await interaction.channel?.messages.fetch(MsgId);
      if(command && message) {
        command.execute(message);
        await interaction.message.delete().catch(e => {});
      }
      }
    }
  }
  