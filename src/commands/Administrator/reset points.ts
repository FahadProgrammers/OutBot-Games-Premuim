import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import schema_1 from "../../schema/SchemaUsers";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";

export default class help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("reset")
        .setDescription("إعادة تعيين نقاط الأعضاء.")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommand((sub) =>
          sub
            .setName("points")
            .setDescription("إعادة تعيين نقاط الأعضاء.")
            .addUserOption((user) =>
              user.setName("member").setDescription("العضو").setRequired(false)
            )
        ),
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
  
      const { options } = interaction;
      const member = options.getUser("member");
  
      if (member) {
        const membermention = `<@${member.id}>`;
        const emb = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "هل انت متأكد من حذف بيانات المستخدم؟",
            fields: membermention,
            footer: "تأكيد الحذف",
            line: true,
          },
          "Base"
        );
  
        const embErrorNoData = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "المستخدم لا يملك بيانات! :x:",
            fields: membermention,
            footer: "خطأ",
            line: true,
          },
          "Error"
        );
  
        const find = await schema_1.findOne({
          guildId: interaction.guild.id,
          userId: member.id,
        });
  
        if (!find && embErrorNoData) {
          await interaction.editReply({
            embeds: [embErrorNoData],
          });
          return;
        }
  
        const btn1 = new ButtonBuilder()
          .setLabel("نعم")
          .setCustomId(`yes_${interaction.user.id}`)
          .setStyle(ButtonStyle.Success);
  
        const btn2 = new ButtonBuilder()
          .setLabel("إلغاء")
          .setCustomId(`no_${interaction.user.id}`)
          .setStyle(ButtonStyle.Danger);
  
        const btnrow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          btn1,
          btn2
        );
  
        if(emb) {
        const mm = await interaction.editReply({
          embeds: [emb],
          components: [btnrow],
        });
  
        const coll = await mm.createMessageComponentCollector({
          time: 10000,
          filter: (m) => !m.user.bot,
          componentType: ComponentType.Button,
        });
  
        coll.on("collect", async (m) => {
          if(!interaction.guild) return;
          const embSuccess = await BaseEmbed(
            this.client,
            interaction.guild,
            {
              title: "تم بنجاح تنفيذ الأمر",
              fields: "تم حذف البيانات بنجاح.",
              footer: "إعادة تعيين البيانات",
              line: true,
            },
            "Success"
          );
  
          const embNo = await BaseEmbed(
            this.client,
            interaction.guild,
            {
              title: "تم بنجاح إلغاء تنفيذ الأمر",
              fields: "تم إلغاء الحذف.",
              footer: "إلغاء الإجراء",
              line: true,
            },
            "Cancel"
          );
  
          if (m.customId === `yes_${m.user.id}`) {
            await schema_1.deleteOne({
              guildId: interaction.guild?.id,
              userId: member.id,
            });
            if(embSuccess)
            await m.update({
              embeds: [embSuccess],
              components: [],
            });
          } else if (m.customId === `no_${m.user.id}`) {
            if(embNo)
            await m.update({
              embeds: [embNo],
              components: [],
            });
          }
        });
      }
     } else {
        const emb = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "هل انت متأكد من حذف بيانات المستخدمين؟",
            footer: "تأكيد الحذف لجميع المستخدمين",
            line: true,
          },
          "Base"
        );
  
        const embErrorNoData = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "السيرفر لا يملك بيانات! :x:",
            footer: "خطأ",
            line: true,
          },
          "Error"
        );
  
        const find = await schema_1.findOne({
          guildId: interaction.guild.id,
        });
  
        if (!find && embErrorNoData) {
          await interaction.editReply({
            embeds: [embErrorNoData],
          });
          return;
        }
  
        const btn1 = new ButtonBuilder()
          .setLabel("نعم")
          .setCustomId(`yes_${interaction.guild.id}`)
          .setStyle(ButtonStyle.Success);
  
        const btn2 = new ButtonBuilder()
          .setLabel("إلغاء")
          .setCustomId(`no_${interaction.guild.id}`)
          .setStyle(ButtonStyle.Danger);
  
        const btnrow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          btn1,
          btn2
        );
  if(emb) {
        const mm = await interaction.editReply({
          embeds: [emb],
          components: [btnrow],
        });
  
        const coll = await mm.createMessageComponentCollector({
          time: 10000,
          filter: (m) => !m.user.bot,
          componentType: ComponentType.Button,
        });
  
        coll.on("collect", async (m) => {
          if(!interaction.guild) return;
          const embSuccess = await BaseEmbed(
            this.client,
            interaction.guild,
            {
              title: "تم بنجاح تنفيذ الأمر",
              fields: "تم حذف بيانات جميع المستخدمين بنجاح.",
              footer: "إعادة تعيين البيانات",
              line: true,
            },
            "Success"
          );

          if(!interaction.guild) return;
  
          const embNo = await BaseEmbed(
            this.client,
            interaction.guild,
            {
              title: "تم بنجاح إلغاء تنفيذ الأمر",
              fields: "تم إلغاء الحذف لجميع المستخدمين.",
              footer: "إلغاء الإجراء",
              line: true,
            },
            "Cancel"
          );
  
          if (m.customId === `yes_${m.guild?.id}`) {
            await schema_1.deleteMany({
              guildId: interaction.guild?.id,
            });
            if(embSuccess) 
            await m.update({
              embeds: [embSuccess],
              components: [],
            });
          } else if (m.customId === `no_${m.guild?.id}`) {
            if(embNo)
            await m.update({
              embeds: [embNo],
              components: [],
            });
          }
        });
      }
    }
  }
}