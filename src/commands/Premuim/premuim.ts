import {
  ActionRowBuilder,
  Attachment,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  ColorResolvable,
  ComponentType,
  EmbedBuilder,
  MakeErrorOptions,
  MessageFlags,
  PermissionFlagsBits,
  PresenceStatusData,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import BaseEmbed from "../../utils/embeds/BaseEmbed";
import emoji from "../../utils/functions/emojis";
import SchemaPremuim from "../../schema/SchemaPremuim";
import SchemaEmbedColor from "../../schema/SchemaEmbedColor";
import SchemaChannel from "../../schema/SchemaChannel";
import path from "path";
import SchemaTheme from "../../schema/SchemaTheme";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("premuim")
        .setDescription("premuim...")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator
        )
        .addSubcommandGroup((command) => command
      .setName("embed")
      .setDescription("إعداد بعض من خصائص الايمبد.")
      .addSubcommand((command) => command
    .setName('add')
    .setDescription('إعداد بعض من خصائص الايمبد.')
    .addStringOption((command) => command
  .setName('color')
.setDescription('ضع رمز اللون ب مثال ) ( #ffffff ).')
.setRequired(true))
  )
  .addSubcommand((cmd) => cmd
  .setName('remove')
  .setDescription('إزالة بعض من خصائص الايمبد.')
)
      )
      .addSubcommandGroup((Cmd) => Cmd
    .setName('game')
  .setDescription("اعدادات الالعاب.")
  .addSubcommand(cmd => cmd
    .setName('theme')
    .setDescription("اختيار الصوره المُرسله في اوامر الالعاب.")
  )
  .addSubcommand(cmd => cmd
    .setName('time')
    .setDescription("اختيار مدة انتهى وقت اللعبه. ( ان لا يقل عن 4 ثوانً )")
    .addNumberOption(cmd => cmd
      .setName('time')
      .setDescription("اختيار مدة انتهى وقت اللعبه. ( ان لا يقل عن 4 ثوانً )")
      .setRequired(true)
    )
    .addChannelOption(cmd => cmd
      .setName('channel')
      .setDescription("حدد الروم التي يتم وضع الوقت فيها.")
      .setRequired(true)
    )
  )
)
  .addSubcommandGroup((command) => command
      .setName("bot")
      .setDescription(`اضافة اسم البوت.`)
      .addSubcommand(cmd => cmd
        .setName('setbanner')
        .setDescription('اختيار بنر البوت.')
        .addStringOption(cmd => cmd
          .setName('avatar')
          .setDescription('ضع رابط البنر.')
          .setRequired(true)
        )
      )
      .addSubcommand((cmd) => cmd
    .setName('setstatus')
      .setDescription('نحديد حالة البوت.')
      .addStringOption((cmd) => cmd
    .setName('status')
    .setDescription('نحديد حالة البوت.')  
    .setRequired(true)  
      .addChoices(
				{ name: 'online', value: 'online' },
				{ name: 'dnd', value: 'dnd' },
				{ name: 'idle', value: 'idle' },
			)))
      .addSubcommand((command) => command
    .setName('setname')
    .setDescription(`اضافة اسم البوت.`)

      .addStringOption((option) =>
                option
                  .setName("name")
                  .setDescription("تعيين اسم البوت.")
                  .setRequired(true)
      ))
      .addSubcommand((command) => command
      .setName('setavatar')
      .setDescription(`اضافة صورة البوت.`)
  
        .addAttachmentOption((option) =>
                  option
                    .setName("avatar")
                    .setDescription("تعيين صورة البوت. ضع الرابط")
                    .setRequired(true)
        ))
      ,
    )
  ,
      category: Category.ادمن,
      cooldown: 0,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
    const subCommand = interaction.options.getSubcommand();
    const subCommandG = interaction.options.getSubcommandGroup();
     await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.guild?.id) {
      return interaction.editReply({
        content: `${emoji.false} | ?`,
      });
    }
    const find = await SchemaPremuim.findOne({
      botId: this.client.user?.id
    });
    if(!find) {
      await interaction.editReply({
        content: "امبوستر!"
      });
      return;
    } else {
      if(find.owner !== interaction.user.id) {
        const EmbedErr2 = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "مهلا!", 
            des: `${emoji.false} | انت لست بمالك البوت ل التحكم فيه!`,
    line: false,
    footer: "Error.",
    fields: "Error.",
          }, 
          "Error",
        );
        if(EmbedErr2) {
          await interaction.editReply({
            embeds: [EmbedErr2]
          });
          return;
        }
   }
    }
    if(subCommandG === "bot" && subCommand === "setname") {
    const data =
      (await SchemaPremuim.findOne({
        guildId: interaction.guild.id,
      })) || null;
    const TargetName = interaction.options.getString("name");

    const EmbedErr2 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "مهلا!", 
        des: `${emoji.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
line: false,
footer: "Error.",
fields: "Error.",
      }, 
      "Error",
    );
    const EmbedErr1 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "مهلا!", 
        des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
      }, 
      "Error",
    );
    if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
  embeds: [EmbedErr1]
})
    }
    if (EmbedErr2 && TargetName === "") {
      await interaction.editReply({
        embeds: [EmbedErr2],
      });
      return;
    }

    try { 
      await this.client.user?.setUsername(TargetName ?? "OutBot Games"); 
      const EmbedSuccess = await BaseEmbed(
        this.client,
        interaction.guild, 
        { 
            title: "تم بنجاح!",  
            des: `${emoji.true} | تم بنجاح **تغير الأسم**.`, 
            line: false, 
            footer: "تم بنجاح.", 
            fields: "تم بنجاح.", 
        },  
        "Success"
    ); 
    
    if(EmbedSuccess) {
    await interaction.editReply({ embeds: [EmbedSuccess] });
    return;
} 

  } catch (err: any) {   
      if (err.message.includes("too fast.") || err.status === 429) {  
          
          const EmbedErr = await BaseEmbed(
            this.client,
              interaction.guild, 
              { 
                  title: "مهلا!",  
                  des: `${emoji.false} | "**لقد **قمت** بتغيير الاسم بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`, 
                  line: false, 
                  footer: "Error.", 
                  fields: "Error.", 
              },  
              "Error"
          ); 
          
          if(EmbedErr) {
          await interaction.editReply({ embeds: [EmbedErr] });
          return;
      } 
    }
  
      else if (err.message.includes("Invalid Username")) {  
          const EmbedErr = await BaseEmbed(
            this.client,
              interaction.guild, 
              { 
                  title: "مهلا!",  
                  des: `${emoji.false} | "**الاسم **غير** صحيح - "**يرجى تعديله.`, 
                  line: false, 
                  footer: "Error.", 
                  fields: "Error.", 
              },  
              "Error"
          ); 
          
          if(EmbedErr) {
          await interaction.editReply({ embeds: [EmbedErr] });
          return;
      } 
    }
      
      else if (err.code === 50035 && err.message.includes("BASE_TYPE_BAD_LENGTH")) {  
          const EmbedErr = await BaseEmbed(
            this.client,
            interaction.guild, 
              { 
                  title: "مهلا!",  
                  des: `${emoji.false} | الاسم يجب أن يكون **ما** بين **2** و **32** حرفًا!`, 
                  line: false, 
                  footer: "Error.", 
                  fields: "Error.", 
              },  
              "Error"
          ); 
          if(EmbedErr) {
          await interaction.editReply({ embeds: [EmbedErr] });
          return;
      } 
    }
            console.error("⚠️ خطأ غير متوقع:", err);
    }
  } else if(subCommandG === "bot" && subCommand === "setavatar") {
    const data =
      (await SchemaPremuim.findOne({
        guildId: interaction.guild.id,
      })) || null;
    const TargetAvatar = interaction.options.getAttachment("avatar");

    if(TargetAvatar) {
    const EmbedErr2 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "مهلا!", 
        des: `${emoji.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
line: false,
footer: "Error.",
fields: "Error.",
      }, 
      "Error",
    );
    const EmbedErr1 = await BaseEmbed(
      this.client,
      interaction.guild,
      {
        title: "مهلا!", 
        des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
      }, 
      "Error",
    );
    if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
  embeds: [EmbedErr1]
})
    }
    if (EmbedErr2 && TargetAvatar === null) {
      await interaction.editReply({
        embeds: [EmbedErr2],
      });
      return;
    }

    try { 
      await this.client.user?.setAvatar(TargetAvatar.url ?? emoji.BaseURL);
      const EmbedSuccess = await BaseEmbed(
        this.client,
        interaction.guild, 
        { 
            title: "تم بنجاح!",  
            des: `${emoji.true} | تم بنجاح **تغير الصوره**.`, 
            line: false, 
            footer: "تم بنجاح.", 
            fields: "تم بنجاح.", 
        },  
        "Success"
    ); 
    
    if(EmbedSuccess) {
    await interaction.editReply({ embeds: [EmbedSuccess] });
    return;
} 

  } catch (err: any) {   
      if (err.message.includes("too fast.") || err.status === 429) {  
          
          const EmbedErr = await BaseEmbed(
            this.client,
              interaction.guild, 
              { 
                  title: "مهلا!",  
                  des: `${emoji.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`, 
                  line: false, 
                  footer: "Error.", 
                  fields: "Error.", 
              },  
              "Error"
          ); 
          
          if(EmbedErr) {
          await interaction.editReply({ embeds: [EmbedErr] });
          return;
      } 
    }
  
      else if (err.message.includes("Invalid Avatar")) {  
          const EmbedErr = await BaseEmbed(
            this.client,
              interaction.guild, 
              { 
                  title: "مهلا!",  
                  des: `${emoji.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`, 
                  line: false, 
                  footer: "Error.", 
                  fields: "Error.", 
              },  
              "Error"
          ); 
          
          if(EmbedErr) {
          await interaction.editReply({ embeds: [EmbedErr] });
          return;
      } 
    }
  }
  } 
} else if(subCommandG === "embed" && subCommand === "add") {
  const find = await SchemaPremuim.findOne({
    botId: this.client.user?.id
  });
  if(!find) {
    await interaction.editReply({
      content: "امبوستر!"
    });
    return;
  } else {
    if(find.owner !== interaction.user.id) {
      const EmbedErr2 = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "مهلا!", 
          des: `${emoji.false} | انت لست بمالك البوت ل التحكم فيه!`,
  line: false,
  footer: "Error.",
  fields: "Error.",
        }, 
        "Error",
      );
      if(EmbedErr2) {
        await interaction.editReply({
          embeds: [EmbedErr2]
        });
        return;
      }
    }
  }
    const color = interaction.options.getString('color');
  if(color) {
    await SchemaEmbedColor.findOneAndUpdate({
      guildId: interaction.guild.id
    }, {
      embedcolor: color.startsWith("#") ? color : "#"+color
    }, { upsert: true, new: true });
  }
  const embed = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "تم بنجاح!",
      des: `${emoji.true} | تم بنجاح تنفيذ المطلوب!`,
      line: false,
      footer: "Success.",
      fields: "Success."
    },
    "Success"
  );
  if(embed) {
  await interaction.editReply({
    embeds: [embed]
  })
  }
} else if(subCommandG === "embed" && subCommand === "remove") {
  await SchemaEmbedColor.findOneAndDelete({ guildId: interaction.guild.id }).catch(() => {});

  const embed = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "تم بنجاح!",
      des: `${emoji.true} | تم بنجاح تنفيذ المطلوب!`,
      line: false,
      footer: "Success.",
      fields: "Success."
    },
    "Success"
  );
  if(embed) {
  await interaction.editReply({
    embeds: [embed]
  })
  }
}    if(subCommandG === "bot" && subCommand === "setstatus") {
  const data =
    (await SchemaPremuim.findOne({
      guildId: interaction.guild.id,
    })) || null;
  const TargetStatus = interaction.options.getString("status") as PresenceStatusData;

  const EmbedErr2 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  const EmbedErr1 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
embeds: [EmbedErr1]
})
  }
  if (EmbedErr2 && TargetStatus === null) {
    await interaction.editReply({
      embeds: [EmbedErr2],
    });
    return;
  }

  try { 
    this.client.user?.setStatus(TargetStatus ?? "online"); 
    const EmbedSuccess = await BaseEmbed(
      this.client,
      interaction.guild, 
      { 
          title: "تم بنجاح!",  
          des: `${emoji.true} | تم بنجاح **تغير الحاله**.`, 
          line: false, 
          footer: "تم بنجاح.", 
          fields: "تم بنجاح.", 
      },  
      "Success"
  ); 
  
  if(EmbedSuccess) {
  await interaction.editReply({ embeds: [EmbedSuccess] });
  return;
} 

} catch (err: any) {   
    if (err.message.includes("too fast.") || err.status === 429) {  
        
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**لقد **قمت** بتغيير الحاله بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }

    else if (err.message.includes("Invalid Status")) {  
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**الحاله **غير** صحيحه - "**يرجى تعديله.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }
  }  
} else if(subCommandG === "bot" && subCommand === "setavatar") {
  const data =
    (await SchemaPremuim.findOne({
      guildId: interaction.guild.id,
    })) || null;
  const TargetAvatar = interaction.options.getAttachment("avatar");

  if(TargetAvatar) {
  const EmbedErr2 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | تأكد من الاسم المعطى أو أن البوت صحيح!`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  const EmbedErr1 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
embeds: [EmbedErr1]
})
  }
  if (EmbedErr2 && TargetAvatar === null) {
    await interaction.editReply({
      embeds: [EmbedErr2],
    });
    return;
  }

  try { 
    await this.client.user?.setAvatar(TargetAvatar.url ?? emoji.BaseURL);
    const EmbedSuccess = await BaseEmbed(
      this.client,
      interaction.guild, 
      { 
          title: "تم بنجاح!",  
          des: `${emoji.true} | تم بنجاح **تغير الصوره**.`, 
          line: false, 
          footer: "تم بنجاح.", 
          fields: "تم بنجاح.", 
      },  
      "Success"
  ); 
  
  if(EmbedSuccess) {
  await interaction.editReply({ embeds: [EmbedSuccess] });
  return;
} 

} catch (err: any) {   
    if (err.message.includes("too fast.") || err.status === 429) {  
        
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }

    else if (err.message.includes("Invalid Avatar")) {  
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }
}
} 
} else if(subCommandG === "embed" && subCommand === "add") {
  const find = await SchemaPremuim.findOne({
    botId: this.client.user?.id
  });
  if(!find) {
    await interaction.editReply({
      content: "امبوستر!"
    });
    return;
  } else {
    if(find.owner !== interaction.user.id) {
      const EmbedErr2 = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "مهلا!", 
          des: `${emoji.false} | انت لست بمالك البوت ل التحكم فيه!`,
  line: false,
  footer: "Error.",
  fields: "Error.",
        }, 
        "Error",
      );
      if(EmbedErr2) {
        await interaction.editReply({
          embeds: [EmbedErr2]
        });
        return;
      }
 }
}
  const color = interaction.options.getString('color');
if(color) {
  await SchemaEmbedColor.findOneAndUpdate({
    guildId: interaction.guild.id
  }, {
    embedcolor: color.startsWith("#") ? color : "#"+color
  }, { upsert: true, new: true });
}
const embed = await BaseEmbed(
  this.client,
  interaction.guild,
  {
    title: "تم بنجاح!",
    des: `${emoji.true} | تم بنجاح تنفيذ المطلوب!`,
    line: false,
    footer: "Success.",
    fields: "Success."
  },
  "Success"
);
if(embed) {
await interaction.editReply({
  embeds: [embed]
})
}
} else if(subCommandG === "bot" && subCommand === "setbanner") {
  const data =
    (await SchemaPremuim.findOne({
      guildId: interaction.guild.id,
    })) || null;
  const TargetBanner = interaction.options.getAttachment("banner");

  if(TargetBanner) {
  const EmbedErr2 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | تأكد من الصوره المعطى أو أن البوت صحيح!`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  const EmbedErr1 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
embeds: [EmbedErr1]
})
  }
  if (EmbedErr2 && TargetBanner === null) {
    await interaction.editReply({
      embeds: [EmbedErr2],
    });
    return;
  }

  try { 
    await this.client.user?.setAvatar(TargetBanner.url ?? emoji.BaseURL);
    const EmbedSuccess = await BaseEmbed(
      this.client,
      interaction.guild, 
      { 
          title: "تم بنجاح!",  
          des: `${emoji.true} | تم بنجاح **تغير البنر**.`, 
          line: false, 
          footer: "تم بنجاح.", 
          fields: "تم بنجاح.", 
      },  
      "Success"
  ); 
  
  if(EmbedSuccess) {
  await interaction.editReply({ embeds: [EmbedSuccess] });
  return;
} 

} catch (err: any) {   
    if (err.message.includes("too fast.") || err.status === 429) {  
        
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**لقد **قمت** بتغيير الصوره بشكل متكرر - "**يرجى الانتظار.\nيرجى **الانتظار**.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }

    else if (err.message.includes("Invalid Avatar")) {  
        const EmbedErr = await BaseEmbed(
          this.client,
            interaction.guild, 
            { 
                title: "مهلا!",  
                des: `${emoji.false} | "**الصوره **غير** صحيحه - "**يرجى تعديله.`, 
                line: false, 
                footer: "Error.", 
                fields: "Error.", 
            },  
            "Error"
        ); 
        
        if(EmbedErr) {
        await interaction.editReply({ embeds: [EmbedErr] });
        return;
    } 
  }
}
} 
} else if(subCommandG === "game" && subCommand === "time") {
  const find = await SchemaPremuim.findOne({
    botId: this.client.user?.id
  });
  if(!find) {
    await interaction.editReply({
      content: "امبوستر!"
    });
    return;
  } else {
    if(find.owner !== interaction.user.id) {
      const EmbedErr2 = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "مهلا!", 
          des: `${emoji.false} | انت لست بمالك البوت ل التحكم فيه!`,
  line: false,
  footer: "Error.",
  fields: "Error.",
        }, 
        "Error",
      );
      if(EmbedErr2) {
        await interaction.editReply({
          embeds: [EmbedErr2]
        });
        return;
      }
 }
}
  const TargetTime = interaction.options.getNumber("time");
  const data =
    (await SchemaPremuim.findOne({
      guildId: interaction.guild.id,
    })) || null;

    

  const EmbedErr2 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | يجب ان يكون الوقت المعطى اكبر من **4** ثوان`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  const EmbedErr1 = await BaseEmbed(
    this.client,
    interaction.guild,
    {
      title: "مهلا!", 
      des: `${emoji.false} | انت **لست** مالك **هاذا البوت**.`,
line: false,
footer: "Error.",
fields: "Error.",
    }, 
    "Error",
  );
  if(EmbedErr1 && data && data.owner !== interaction.user.id) {
return await interaction.editReply({
embeds: [EmbedErr1]
})
  }
  if(TargetTime)
  if (EmbedErr2 && 4 > TargetTime) {
    await interaction.editReply({
      embeds: [EmbedErr2],
    });
    return;
  }


    await SchemaChannel.findOneAndUpdate({
      guildId: interaction.guild?.id,
      channelId: { $in: interaction.channel?.id }
    }, {
      time: TargetTime
    }, { upsert: true, new: true });
       const EmbedSuccess = await BaseEmbed(
      this.client,
      interaction.guild, 
      { 
          title: "تم بنجاح!",  
          des: `${emoji.true} | تم بنجاح **تعيين الوقت.**.`, 
          line: false, 
          footer: "تم بنجاح.", 
          fields: "تم بنجاح.", 
      },  
      "Success"
  ); 
  
  if(EmbedSuccess) {
  await interaction.editReply({ embeds: [EmbedSuccess] });
  return;
} 
} else if(subCommandG === "game" && subCommand === "theme") {
  const findd = await SchemaPremuim.findOne({
    botId: this.client.user?.id
  });
  if(!findd) {
    await interaction.editReply({
      content: "امبوستر!"
    });
    return;
  } else {
    if(findd.owner !== interaction.user.id) {
      const EmbedErr2 = await BaseEmbed(
        this.client,
        interaction.guild,
        {
          title: "مهلا!", 
          des: `${emoji.false} | انت لست بمالك البوت ل التحكم فيه!`,
  line: false,
  footer: "Error.",
  fields: "Error.",
        }, 
        "Error",
      );
      if(EmbedErr2) {
        await interaction.editReply({
          embeds: [EmbedErr2]
        });
        return;
      }
 }
}
     let color: ColorResolvable = "Red";
          const find = await SchemaEmbedColor.findOne({ guildId: interaction.guild?.id });
          if (find) {
              color = find.embedcolor as ColorResolvable;
          }
  
  const Embed1 = new EmbedBuilder()
  .setTitle("**1**")
  .setColor(color)
  .setImage('attachment://theme_1.png');
  const Embed2 = new EmbedBuilder()
  .setTitle("**2**")
  .setColor(color)
  .setImage('attachment://theme_2.png');
      const res1 = path.resolve("src/utils/assets/Themes", "OutBot_Games_Background1.png");
      const res2 = path.resolve("src/utils/assets/Themes", "OutBot_Games_Background2.png");
  const attach1 = new AttachmentBuilder(res1, { name: "theme_1.png" }); 
  const attach2 = new AttachmentBuilder(res2, { name: "theme_2.png" });
  const btns = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setLabel('1')
    .setCustomId('1_theme')
    .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
    .setLabel('2')
    .setCustomId('2_theme')
    .setStyle(ButtonStyle.Primary)
  )
  const msg = await interaction.editReply({
    embeds: [Embed1, Embed2],
    files: [attach1, attach2],
    components: [btns]
  });
  
const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15_000 });

collector.on('collect', async (i)=> {
	if (i.user.id === interaction.user.id && interaction.guild) {
        const emb = await BaseEmbed(
          this.client,
          interaction.guild,
          {
            title: "تم بنجاح!",
            des: "تم بنجاح تعيين الثيم!",
            line: false,
            fields: "Success.",
            footer: "Success.",
          },
          "Success"
        );
        if(emb) {
          btns.components[0].setDisabled(true);
          btns.components[1].setDisabled(true);
    i.deferReply({ ephemeral: true })
		i.reply({ embeds: [emb], flags: MessageFlags.Ephemeral });
    await SchemaTheme.findOneAndUpdate({
      guildId: interaction.guild.id
    }, {
      theme: i.customId.split("_")[0],
    },{ upsert: true, new: true });

	} 
} else {
    i.reply({ content: `These buttons aren't for you!`, flags: MessageFlags.Ephemeral });
	}
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} interactions.`);
});
}
} catch(err) {
console.log('Error to /premuim', err)
}
  }
}
