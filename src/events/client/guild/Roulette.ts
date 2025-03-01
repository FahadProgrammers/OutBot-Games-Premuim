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
    if (interaction.customId.startsWith("roulette_")) {
      const [, action, playerId, guildId, id, playerNum] =
        interaction.customId.split("_");

      if (action === "kick") {
        //Fetch Main Message To id
        if (interaction.user.id !== playerId) {
          await interaction.reply({
            content: `شلون يعني؟`,
            ephemeral: true,
          });
        }
        const message = await interaction.channel?.messages.fetch(id);

        const findRoulette = await schemaGame.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
          msgId: id,
        });

        //Find User
        const findUser = findRoulette?.players.find(
          (p) => p.userId === playerId
        );

        if (findRoulette && findUser) {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: `${emoji.true} | تم بنجاح`,
              ephemeral: true,
            });
          }
          if (findUser.security) {
            if (interaction.channel instanceof TextChannel) {
              await interaction.channel.send({
                content: `<:security1:1329156583992590456> تم حمايته من قبل الحارس الشخصي!`,
              });

              if (message) {
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
                          component.customId ??
                          `${interaction.user.id}_${playerNum}`,
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

                await interaction.message.edit({
                  components: components.map((row) => row.toJSON()),
                });

                // تحديث بيانات اللاعب
                findUser.security = false;
                findUser.securityUsed = false;
                await findRoulette.save();

                // بدء لعبة الروليت مرة أخرى
                await startRouletteGame(
                  message,
                  findRoulette.players,
                  this.client,
                  id
                );
              }
            }
          }
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
                  component.customId ?? `${interaction.user.id}_${playerNum}`,
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

        await interaction.message.edit({
          components: components.map((row) => row.toJSON()),
        });

        // الرد النهائي فقط إذا لم يكن قد تم الرد مسبقًا
        if (interaction.channel instanceof TextChannel) {
          await interaction.channel?.send({
            content: `<:emoji_29:1327724572635697345> | لقد تم **طرد** <@${playerId}> 
         من **قبل**: <@${interaction.user?.id}>`,
          });
        }

        const find = findRoulette?.players.find(
          (p) => p.number === Number(playerNum)
        );
        if (find && findRoulette) {
          findRoulette.players = findRoulette.players.filter(
            (x) => x.number != Number(playerNum)
          );
          await findRoulette.save();
        }

        if (!findRoulette) return;
        if (!message) return;
        await startRouletteGame(message, findRoulette.players, this.client, id);
      } else if (action === "secruity") {
        const findPointsRoulette = await roulettePoints.findOne({
          guildId: interaction.guild?.id,
          userId: interaction.user?.id,
        });
        if (!findPointsRoulette || findPointsRoulette?.p < 100) {
          await interaction.reply({
            content: `ليس لديك النقاط الكافية لتفعيل الحارس الشخصي تحتاج الى: \`${
              findPointsRoulette ? findPointsRoulette.p - 100 : "لاتملك"
            }\``,
            ephemeral: true,
          });
          return;
        }

        const message = await interaction.channel?.messages.fetch(id);
        const findRoulette = await schemaGame.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
          msgId: id,
        });
        const findUser = findRoulette?.players.find(
          (p) => p.userId === playerId
        );

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
                  component.customId ?? `${interaction.user.id}_${playerNum}`,
                emoji: component.emoji ?? { name: ":fire:" },
              };

              if (!buttonData.label && !(component.data as any).emoji) {
                buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
              }
              actionRow.addComponents(new ButtonBuilder(buttonData));
            }
          });

          return actionRow;
        }) as ActionRowBuilder<ButtonBuilder>[];


        if (
          components.length > 0 &&
          components[0].components[0].data.type === ComponentType.Button &&
          components[0].components[2].data.type === ComponentType.Button
        ) {
        if (findRoulette?.dobuleUsed === true) {
          (components[0].components[1] as ButtonBuilder).setDisabled(true);
        }
          (components[0].components[0] as ButtonBuilder).setDisabled(true);
          (components[0].components[2] as ButtonBuilder).setDisabled(true);

          await interaction.update({
            components: components.map((row) => row.toJSON()),
          });
        }

      } else if (action === "cancel") {
        const findPointsRoulette = await roulettePoints.findOne({
          guildId: interaction.guild?.id,
          userId: interaction.user?.id,
        });
        if (!findPointsRoulette || findPointsRoulette?.p < 150) {
          await interaction.reply({
            content: `ليس لديك النقاط الكافية لتفعيل الغاء روليت تحتاج الى: \`${
              findPointsRoulette ? findPointsRoulette.p - 150 : "لاتملك"
            }\``,
            ephemeral: true,
          });
          return;
        }
        const findRoulette = await schemaGame.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
          msgId: id,
        });

        const findUser = findRoulette?.players.find(
          (p) => p.userId === playerId
        );

        if (findRoulette && findUser) {
          findUser.cancel = true;
          findUser.cancelUsed = true;
          await findRoulette.save();
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
                  component.customId ?? `${interaction.user.id}_${playerNum}`,
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

        await interaction.update({
          components: components.map((row) => row.toJSON()),
        });

        if (interaction.channel instanceof TextChannel) {
          interaction.channel.send({
            content: `<:emoji_24:1327724457732603945> | تم الغاء جولة الروليت, من هو الفاعل ياترى؟ 🤔`,
          });
        }
      } else if (action === "withdraw") {
        const message = await interaction.channel?.messages.fetch(id);
        const findRoulette = await schemaGame.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
          msgId: id,
        });

        const findUser = findRoulette?.players.find(
          (p) => p.userId === playerId
        );

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
                  component.customId ?? `${interaction.user.id}_${playerNum}`,
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

        await interaction.update({
          components: components.map((row) => row.toJSON()),
        });

        const find = findRoulette?.players.find(
          (p) => p.userId === interaction.user?.id
        );
        if (find && findRoulette) {
          findRoulette.players = findRoulette.players.filter(
            (x) => x.userId != interaction.user.id
          );
          await findRoulette.save();
          if (interaction.channel instanceof TextChannel) {
            await interaction.channel.send({
              content: `<:emoji_30:1327724585562407024> | لقد انسحب من اللعبه!`,
            });
          }
        }
      } else if (action === "dobule") {
        const findPointsRoulette = await roulettePoints.findOne({
          guildId: interaction.guild?.id,
          userId: interaction.user?.id,
        });
        if (!findPointsRoulette || findPointsRoulette?.p < 50) {
          await interaction.reply({
            content: `ليس لديك النقاط الكافية لتفعيل دبل نقاط روليت تحتاج الى: \`${
              findPointsRoulette ? findPointsRoulette.p - 50 : "لاتملك"
            }\``,
            ephemeral: true,
          });
          return;
        }
        const message = await interaction.channel?.messages.fetch(id);
        const findRoulette = await schemaGame.findOne({
          guildId: interaction.guild?.id,
          channelId: interaction.channel?.id,
          msgId: id,
        });

        const findUser = findRoulette?.players.find(
          (p) => p.userId === playerId
        );

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
                  component.customId ?? `${interaction.user.id}_${playerNum}`,
                emoji: component.emoji ?? { name: ":fire:" },
              };

              if (!buttonData.label && !(component.data as any).emoji) {
                buttonData.label = "زر افتراضي"; // تعيين نص افتراضي إذا لم يكن هناك label أو emoji
              }
              actionRow.addComponents(new ButtonBuilder(buttonData));
            }
          });

          return actionRow;
        }) as ActionRowBuilder<ButtonBuilder>[];

        if (
          components.length > 0 &&
          components[0].components[1].data.type === ComponentType.Button &&
          components[0].components[2].data.type === ComponentType.Button
        ) {
          if (findUser?.securityUsed === true) {
            (components[0].components[0] as ButtonBuilder).setDisabled(true);
          }
          (components[0].components[1] as ButtonBuilder).setDisabled(true);
          (components[0].components[2] as ButtonBuilder).setDisabled(true);
          await interaction.update({
            components: components.map((row) => row.toJSON()),
          });
        }

        const find = findRoulette?.players.find(
          (p) => p.userId === interaction.user?.id
        );
        if (find && findRoulette) {
          findRoulette.dobule = true;
          findRoulette.dobuleUsed = true;
          await findRoulette.save();
          if (interaction.channel instanceof TextChannel) {
            await interaction.channel.send({
              content: `<:star:1328433221536583831> | تم تفعيل دبل نقاط في لعبة روليت, من قبل: <@${interaction.user?.id}>`,
            });
          }
        }
      }
    }
  }
}
