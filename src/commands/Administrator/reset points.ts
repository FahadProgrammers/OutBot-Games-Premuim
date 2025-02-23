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
import mainembed from "../../utils/embeds/mainEmbed";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import warnembed from "../../utils/embeds/warnembed";
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
      const emb = mainembed(
        `هل انت متأكد من حذف بيانات المستخدم؟ ${membermention}`
      );
      const embErrorNoData = mainembed(
        `المستخدم لا يملك بيانات! :x: ${membermention}`
      );
      const find =
        (await schema_1.findOne({
          guildId: interaction.guild.id,
          userId: member.id,
        })) || null;
      if (!find) {
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
        if(interaction.guild) {
        const emb = BaseEmbed(
          interaction.guild,
          {
            title: "resetpoints",
            des: `${emoji.true} | تم بنجاح تنفيذ الأمر`,
            line: true,
            footer: `اعادة تعيين`,
            fields: `اعادة تعيين`,
          },
          "Success"
        );
        if(emb) {
        const embNo = warnembed(`${emoji.true} | تم بنجاح إلغاء تنفيذ الأمر`);

        if (m.customId === `yes_${m.user.id}`) {
          await schema_1.deleteOne({
            guildId: interaction.guild?.id,
            userId: member.id,
          });
          await m.update({
            embeds: [emb],
            components: [],
          });
        } else if (m.customId === `no_${m.user.id}`) {
          await m.update({
            embeds: [embNo],
            components: [],
          });
        }
      }
    }
      });
    } else {
      const emb = mainembed(`هل انت متأكد من حذف بيانات المستخدمين؟`);
      const embErrorNoData = warnembed(`السيرفر لا يملك بيانات! :x:`);
      const find = await schema_1.findOne({
        guildId: interaction.guild.id,
      });
      if (!find) {
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
        if(interaction.guild) {
          const emb = BaseEmbed(
            interaction.guild,
            {
              title: "resetpoints",
              des: `${emoji.true} | تم بنجاح تنفيذ الأمر`,
              line: true,
              footer: `اعادة تعيين`,
              fields: `اعادة تعيين`,
            },
            "Success"
          );
          if(emb) {
        const embNo = warnembed(
          `${emoji.true} | تم بنجاح إلغاء تنفيذ الأمر`
        );

        if (m.customId === `yes_${m.guild?.id}`) {
          await schema_1.deleteMany({
            guildId: interaction.guild?.id,
          });
          await m.update({
            embeds: [emb],
            components: [],
          });
        } else if (m.customId === `no_${m.guild?.id}`) {
          await m.update({
            embeds: [embNo],
            components: [],
          });
        }
      }
    }
      });
    }
  }
}
