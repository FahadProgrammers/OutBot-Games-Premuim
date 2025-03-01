import {
  ActionRow,
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Component,
  ComponentType,
  Events,
  TextChannel,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import emoji from "../../../utils/functions/emojis";
import { startRouletteGame } from "../../../utils/roulette/wheel";
import schemaGame from "../../../schema/Roulette/SchemaRoulette";
import roulettePoints from "../../../schema/Roulette/SchemaRoulettePoints";

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

    


    if(interaction.customId.startsWith(`rremove_${interaction.guild?.id}_`)) {
      const [, gid, msgid] = interaction.customId.split("_");
      console.log(msgid)

   if(!interaction.memberPermissions?.has("ManageGuild")) {
    await interaction.reply({
      content: `${emoji.false} | ليس لديك الصلاحيات الكافيه لإلغاء اللعبه!`,
    });
    return;
    }

    const findGame = await schemaGame.findOne({
      guildId: interaction.guild?.id,
      channelId: interaction.channel?.id,
      msgId: msgid,
    });


    if(!findGame) {
      await interaction.reply({
        content: `${emoji.false} | اللعبه غير متوفره للإلغاء!`,
        ephemeral: true
      });
      return;
    }          
    
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
      content: `${emoji.true} | تم إلغاء اللعبه بنجاح!`,
      ephemeral: true
    }); 
    await findGame.deleteOne(); 
  }
    
const components = interaction.message.components.map((row) => {
    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    row.components.forEach((component) => {
      if (component.type === ComponentType.Button) {
        const buttonData = {
          ...component,
          url: component.url ?? undefined, // معالجة الحقل `url`
          label: component.label ?? "زر بدون عنوان", // توفير نص افتراضي
          style: component.data.style ?? ButtonStyle.Primary,
          custom_id:
            component.customId ?? `${interaction.user.id}`,
          emoji: component.emoji ?? { name: ":fire:" },
          disabled: true,
        };

        if (!buttonData.label && !(component.data as any).emoji) {
          buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
        }
        actionRow.addComponents(new ButtonBuilder(buttonData));
      }
    });

    return actionRow;
  }) as ActionRowBuilder<ButtonBuilder>[];

   interaction.message.edit({
    components: components.map((row) => row.toJSON()),
  });



  }
}
}