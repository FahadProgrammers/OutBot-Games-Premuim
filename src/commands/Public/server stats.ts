import {
    ActionRowBuilder,
    Base,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
  } from "discord.js";
  import Command from "../../base/classes/Command";
  import CustomClient from "../../base/classes/CustomClient";
  import Category from "../../base/enums/Category";
  import emoji from "../../utils/functions/emojis";
  import BaseEmbed from "../../utils/embeds/BaseEmbed";
import SchemaChannel from "../../schema/SchemaChannel";
import prefix from "../../schema/SchemaPrefix";
  
  export default class stats extends Command {
    constructor(client: CustomClient) {
      super(client, {
        data: new SlashCommandBuilder()
          .setName("server")
          .setDescription("معرفه معلومات السيرفر بشكل أدق.")
          .addSubcommand(sub => sub
            .setName('stats')
            .setDescription("معرفه معلومات السيرفر بشكل أدق.")
          )
          ,
        category: Category.ادمن,
        cooldown: 0,
      });
    }
  
    async execute(interaction: ChatInputCommandInteraction) {
      await interaction.deferReply({
        ephemeral: true,
      });
      if (!interaction.guild?.id) {
        return interaction.editReply({
          content: `${emoji.false} | ?`,
        });
      }

          const data =
            (await SchemaChannel.findOne({
              guildId: interaction.guild.id,
            })) || null;
        const prefixFind = await prefix.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
        });
            if(data?.date) {
      const Embed = BaseEmbed(
        interaction.guild,
        {
          title: "معلومات السيرفر", 
          des: `رومات الألعاب: **${data?.channelId?.length ? data.channelId.map(id => `<#${id}>`).join(' ') : "لا يوجد"}**\n
          اول روم تم تعيينه في تاريخ: <t:${Math.floor(data?.date?.getTime() / 1000) || "غير متوفر"}:R>\n
          ${prefixFind?.prefix.length === 1 ? "بادئة" : "بادئات"} **البوت**: ${emoji.close} **${prefixFind?.prefix?.join(", ") || "+"}** ${emoji.open}\n
          آخر روم تم تعيينه في تاريخ: <t:${Math.floor(data?.dateend?.getTime() / 1000) || "غير متوفر"}:R>`,
          
  line: false,
  footer: "Server Info.",
  fields: "Server Info.",
        }, 
        "Base",
        
      );
  
    
      if(Embed) {
      await interaction.editReply({
        embeds: [Embed]
      });
    }
  }
  }
}