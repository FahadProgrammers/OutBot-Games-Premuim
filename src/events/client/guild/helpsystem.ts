import {
  AnySelectMenuInteraction,
  EmbedBuilder,
  Events,
  GuildMember,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import mainembedWithUser from "../../../utils/embeds/mainembedWithUser";
import Category from "../../../base/enums/Category";
import utils from "../../../utils/utils";
import emoji from "../../../utils/functions/emojis";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(interaction: AnySelectMenuInteraction) {
    if (!interaction.isChatInputCommand) return;
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === "starter") {
      await interaction.deferReply({
        ephemeral: true,
      });
      const value = interaction.values[0];
      const member = interaction.member as GuildMember;
      const embed = mainembedWithUser(
        undefined,
        `help ( ${value} )`,
        `Game`,
        member
      );
      const commands = this.client.messagecommands;
      const commands2 = this.client.commands;
      let hasCommands = false;

      if(value !== "ادمن" && value !== "all") {
        commands.forEach((command) => {
          if (interaction.guild?.id === "711370689126596618" && command.name === "خمن اليوتيوبر") {
            return;
          }
        
          const isArabic = /[^\u0000-\u007F]/.test(command.name.charAt(0));
        
          embed.addFields({
            name: "<:1323739617790263326:1341704260483551323> " + command.name || "No Name",
            value: "<:file1:1341704211972231249> " + `${command.description} \n اختصارات : ${isArabic ? emoji.close : emoji.open} **${command.aliases.join(",") || "لايوجد"}** ${isArabic ? emoji.open : emoji.close}`,
          });
        
          hasCommands = true;
        });
        
    } else if(value !== "all") {
      commands2.forEach((command) => {
        if (command.category === value) {
    
          embed.addFields({
            name: "<:1323739617790263326:1341704260483551323> "+command.data.name || "No Name",
            value: "<:file1:1341704211972231249> "+`${command.data.description}`,
          });
          hasCommands = true;
        }
      });
    } else if(value === "all") {
      try {
        const embeds = [];
        let currentFields: { name: string; value: string; }[] = [];
        
        commands2.forEach((command) => {
          if(command.category === Category.Dev) return;
          currentFields.push({
            name:  "<:1323739617790263326:1341704260483551323> " + "/" + (command.data.name || "No Name"),
            value:  "<:file1:1341704211972231249> "+`${command.data.description}`,
          });
        

          if (currentFields.length === 25) {
            embeds.push({ fields: currentFields });
            currentFields = [];
          }
        });
        
        commands.forEach((command) => {
          if (interaction.guild?.id === "711370689126596618" && command.name === "خمن اليوتيوبر") {
            return;
          }
        
          const isArabic = /[^\u0000-\u007F]/.test(command.name.charAt(0));
        
          embed.addFields({
            name: "<:1323739617790263326:1341704260483551323> " + command.name || "No Name",
            value: "<:file1:1341704211972231249> " + `${command.description} \n اختصارات : ${isArabic ? emoji.open : emoji.close} **${command.aliases.join(",") || "لايوجد"}** ${isArabic ? emoji.close : emoji.open}`,
          });
        
          hasCommands = true;
                
          if (currentFields.length === 25) {
            embeds.push({ fields: currentFields });
            currentFields = [];
          }
        });
        

        if (currentFields.length > 0) {
          embeds.push({ fields: currentFields });
        }
        
        if (embeds.length > 0) {
          const embedBuilders = embeds.map(embedFields => 
            new EmbedBuilder().addFields(embedFields.fields).setColor('Red').setTitle("OutBot Games | All").setImage(utils.Line)
          );
        
          await interaction.editReply({ embeds: embedBuilders });
        
      }
        
        
      hasCommands = true;
return;
  
  } catch(err) {
    console.log(err)
  }
}

      if (!hasCommands) {
        embed.setDescription("لايوجد اوامر");
      }
      await interaction.editReply({
        embeds: [embed],
      });
    }
  }
}
