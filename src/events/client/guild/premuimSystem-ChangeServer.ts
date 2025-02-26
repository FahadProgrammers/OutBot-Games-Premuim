import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
  GuildMember,
  Interaction,
  Message,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
  time,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import Command from "../../../base/classes/Command";
import emoji from "../../../utils/functions/emojis";
import schemaPremuim from "../../../schema/SchemaPremuim";
import BaseEmbed from "../../../utils/embeds/BaseEmbed";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(interaction: Interaction) {
      if(!interaction.isButton()) return; 
     if (interaction.customId.startsWith("changeserver-premuim")) {
      await interaction.deferReply({
          ephemeral: true
      });

      const dataUserFindOne = await schemaPremuim.findOne({
          owner: interaction.user?.id
      });
      if(!dataUserFindOne) {
          await interaction.editReply({
              content: `لم اجدك في قاعدة البيانات! | ${emoji.false}`
          });
          return;
      }

      const dataUserFind = await schemaPremuim.find({
          owner: interaction.user?.id
      });
      const UserData = dataUserFind.map((data) => ({
          label: `${this.client.guilds.cache.get(data.guildId)?.name} | ${data.guildId}`,
          value: `guild_${data.guildId}`,
      }));
      
      if(!interaction.guild) return;
      const base = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          line: false,
          title: "يرجى اختيار البوت المناسب أدناه",
          footer: "نظام البريميوم",
          fields: "اختر السيرفر لتعديله",
        },
        "Base"
      );

      const select = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("premuimsystem-editserver")
          .addOptions(UserData)
      );

      if(base) {
      await interaction.editReply({
        embeds: [base],
        components: [select],
      });
    }

    } else if (interaction.customId.startsWith("guild_")) {
      const [, guildId] = interaction.customId.split("_");
    }
  }
};
