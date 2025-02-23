import { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  ChatInputCommandInteraction, 
  ComponentType, 
  PermissionFlagsBits, 
  SlashCommandBuilder, 
  TextChannel, 
  TimestampStyles, 
  Interaction, 
  ButtonInteraction, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  StringSelectMenuInteraction, 
  MessageComponentCollectorOptions, 
  Collector, 
  InteractionCollector,
  Message, 
} from "discord.js"; 
import Command from "../../base/classes/Command"; 
import CustomClient from "../../base/classes/CustomClient"; 
import Category from "../../base/enums/Category"; 
import schema_1 from "../../schema/SchemaChannel"; 
import BaseEmbed from "../../utils/embeds/BaseEmbed"; 
import emoji from "../../utils/functions/emojis"; 
import ms from "ms"; 

export default class Test extends Command { 
  constructor(client: CustomClient) { 
    super(client, { 
      data: new SlashCommandBuilder() 
        .setName("poll") 
        .setDescription("channel...") 
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator) 
        .addSubcommand((command) => 
          command 
            .setName("start") 
            .setDescription(`بدء تصويت لتحديد العبة.`) 
            .addStringOption((command) => 
              command.setName("select") 
                .setDescription("تحديد نوع التصويت") 
                .setRequired(true) 
                .addChoices( 
                  { name: 'الالعاب الفردية فقط', value: "one" }, 
                  { name: 'الالعاب الثنائية فقط', value: 'two' }, 
                  { name: 'الالعاب الجماعية فقط', value: 'three' }, 
                  { name: "جميع الالعاب", value: 'all' } 
                ) 
            ) 
            .addStringOption((option) => 
              option.setName("title").setDescription("عنوان التصويت").setRequired(true) 
            ) 
            .addStringOption((option) => 
              option.setName("time").setDescription("مدة التصويت (مثال: 15s)").setRequired(true) 
            ) 
        ) 
        .addSubcommand((command) => 
          command 
            .setName('stop') 
            .setDescription(`إيقاف التصويت.`) 
            .addStringOption((option) => 
              option.setName("messageid").setDescription("ايدي رسالة التصويت").setRequired(true) 
            ) 
        ), 
      category: Category.ادمن, 
      cooldown: 0, 
    }); 
  } 

  async execute(interaction: ChatInputCommandInteraction) { 
    const subCommand = interaction.options.getSubcommand(); 
    const guildId = interaction.guild?.id; 

    if (!guildId) { 
      return interaction.reply({ 
        content: `${emoji.false} | لا يمكن تنفيذ الأمر في هذه الخادم.`, 
        ephemeral: true, 
      }); 
    } 

    if (subCommand === "start") { 
      const title = interaction.options.getString("title"); 
      const selectOption = interaction.options.getString("select"); 
      const time = interaction.options.getString("time"); 

      if (!title || !selectOption || !time) { 
        return interaction.reply({ content: "❌ جميع الخيارات مطلوبة.", ephemeral: true }); 
      } 

      if (!(interaction.channel instanceof TextChannel)) { 
        return interaction.reply({ content: "❌ يجب تنفيذ الأمر في قناة نصية.", ephemeral: true }); 
      } 

      let answers: string[] = []; 
      const categories: Record<string, string | null> = { 
        one: "فرديه", 
        two: "ثنائيه", 
        three: "مجموعه", 
        all: null, 
      }; 

      // إصلاح تحقق الفئات
      if (categories[selectOption]) { 
        this.client.messagecommands.forEach((data) => { 
          if (data.category === categories[selectOption] && data.category !==  Category.ادمن) { 
            answers.push(data.name); 
          } 
        }); 
      } else if (selectOption === "all") { 
        this.client.messagecommands.forEach((data) => {
          if(data.category !== Category.ادمن)  {
          answers.push(data.name); 
        
      }
    }); 
      } 

      if (answers.length === 0) { 
        return interaction.reply({ content: "❌ لم يتم العثور على بيانات متطابقة.", ephemeral: true }); 
      } 

      const selectMenu = new StringSelectMenuBuilder() 
        .setCustomId("poll") 
        .setPlaceholder("اختر الأمر!"); 

      answers.forEach((commandName) => { 
        selectMenu.addOptions( 
          new StringSelectMenuOptionBuilder() 
            .setLabel(commandName) 
            .setValue(`select_${commandName}`) 
        ); 
      }); 

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu); 

      await interaction.reply({ content: "تم إعداد التصويت بنجاح!", ephemeral: true }); 
      const message = await interaction.channel.send({ 
        content: `🔹 **${title}**\nيرجى اختيار أمر من القائمة أدناه.`, 
        components: [row], 
      }); 

      const collector = message.createMessageComponentCollector({ 
        componentType: ComponentType.StringSelect, 
        time: ms(time), 
      }); 

      const votes: Map<string, string> = new Map(); 
      this.client.polls.set(message.id, votes);

      collector.on("collect", async (selectInteraction: StringSelectMenuInteraction) => { 
        const userId = selectInteraction.user.id; 

        if (votes.has(userId)) { 
          return selectInteraction.reply({ content: "❌ لقد قمت بالتصويت بالفعل!", ephemeral: true }); 
        } 

        const selectedValue = selectInteraction.values[0].replace("select_", ""); 
        votes.set(userId, selectedValue); 

        let finalResults = `🛑 **نتائج التصويت:**\n`; 
        const finalCounts: Record<string, number> = {}; 
        votes.forEach((value) => { 
          finalCounts[value] = (finalCounts[value] || 0) + 1; 
        }); 

        // تحديث النتائج
        for (const [command, count] of Object.entries(finalCounts)) { 
          finalResults += `🔹 **${command}**: ${count} تصويت\n`; 
        } 

        await selectInteraction.reply({ 
          content: `✅ تم تسجيل تصويتك لـ **${selectedValue}**`, 
          ephemeral: true, 
        }); 

        await message.edit({ 
          content: finalResults, 
        }); 
      }); 

      collector.on("end", async () => { 
        let finalResults = "🛑 **انتهى التصويت! النتائج النهائية:**\n"; 
        const finalCounts: Record<string, number> = {}; 
        votes.forEach((value) => { 
          finalCounts[value] = (finalCounts[value] || 0) + 1; 
        }); 
      
        const sortedResults = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]); 
      
        sortedResults.forEach(([command, count]) => { 
          finalResults += `🔹 **${command}**: ${count} تصويت\n`; 
        }); 
      
        finalResults += `-------------------\n🥇 **الفائز**: **${sortedResults[0][0]}** \\**${sortedResults[0][1]}** تصويت.`
      
        const disabledRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu.setDisabled(true)); 
      
        await message.edit({ 
          content: `🛑 تم إيقاف التصويت. [رابط التصويت](https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}).`, 
          components: [disabledRow], 
        });
      
        await message.reply({ 
          content: finalResults, 
        }); 
      }); 
      
      
    } else if (subCommand === 'stop') { 
      const messageId = interaction.options.getString("messageid"); 

      if (!messageId) { 
        return interaction.reply({ content: "❌ يجب توفير معرف الرسالة.", ephemeral: true }); 
      }

      const message = await interaction.channel?.messages.fetch(messageId);

      if (!message) {
        return interaction.reply({ content: "❌ لم أتمكن من العثور على الرسالة.", ephemeral: true });
      }

      const votes = this.client.polls.get(message.id); 
      if (!votes) {
        return interaction.reply({ content: "❌ لم أتمكن من العثور على بيانات التصويت.", ephemeral: true });
      }

      let finalResults = "🛑 **انتهى التصويت! النتائج النهائية:**\n";
      const finalCounts: Record<string, number> = {};
      votes.forEach((value) => {
        finalCounts[value] = (finalCounts[value] || 0) + 1;
      });

      const sortedResults = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);

      sortedResults.forEach(([command, count]) => {
        finalResults += `🔹 **${command}**: ${count} تصويت\n`;
      });

      finalResults += `-------------------\n🥇 **الفائز**: **${sortedResults[0][0]}** \n**${sortedResults[0][1]} تصويت**.`;

      await message.edit({
        content: `🛑 تم إيقاف التصويت. [رابط التصويت](https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}).`,
        components: [],
      });

      await interaction.reply({
        content: `${emoji.true} | تم بنجاح إيقاف التصويت`,
        ephemeral: true
      })

    }
  }
}
