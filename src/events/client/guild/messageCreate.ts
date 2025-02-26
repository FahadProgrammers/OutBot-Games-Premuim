import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  Events,
  Message,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import levenshtein from "fast-levenshtein";
import Command from "../../../base/classes/MessageCreate";
import schemaRoleEvent from "../../../schema/SchemaEvent";
import pschema from "../../../schema/SchemaPrefix";
import Category from "../../../base/enums/Category";
import utils from "../../../utils/utils";
import SchemaChannel from "../../../schema/SchemaChannel";
import BaseEmbed from "../../../utils/embeds/BaseEmbed";
import SchemaCommandControl from "../../../schema/SchemaCommandControl";
import SchemaServerUsedStats from "../../../schema/SchemaServerUsedStats";
export default class MessageCommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Command Handler MessageCreate",
      once: false,
    });
  }
  async execute(message: Message) {
    if (!message.content || typeof message.content !== "string") {
      return;
    }
    try {
      const DataPrefix = await pschema.findOne({
        guildId: message.guild?.id,
        channelId: message.channel.id,
      });
      const Channels = await SchemaChannel.findOne({
        guildId: message.guild?.id,
      });

      let prefix = utils.defaultPrefix;
      if (typeof prefix === "string" || Array.isArray(DataPrefix?.prefix)) {  
        let usedPrefix = "";
        
        if (Array.isArray(DataPrefix?.prefix)) { 
          usedPrefix = DataPrefix?.prefix.find(p => message.content.startsWith(p)) || ""; 
          if (!usedPrefix) return;
        } else { 
          usedPrefix = prefix;
if (!message.content.startsWith(usedPrefix)) return; 
        } 
        
        
      const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
      const cmd = args.shift()?.toLowerCase();
      if (!cmd) return;

      if(Channels) {
      if (Channels?.channelId.includes(message.channel.id)) {
        let command: Command | undefined =
          this.client.messagecommands.get(cmd) ||
          this.client.messagecommandshorts.get(cmd);
          
        if (!command) {
          const commands = await this.client.messagecommands;
          let bestMatch = { word: "", distance: Infinity };

          for (const commandd of commands) {
            const distance = levenshtein.get(cmd, commandd[0]);
            if (distance < bestMatch.distance) {
              bestMatch = { word: commandd[0], distance };
            }
          }
      
          if (bestMatch.distance <= 2) {
            if(message.guild) {
            const Embed = await BaseEmbed(
              this.client,
              message.guild,
              {
                title: "الأمر غير صحيح!",
                des: `هل الامر الذي **تقصده** هو: \`${bestMatch.word} \` `,
                line: true,
                footer: "Error.",
                fields: "Error."
              },
              "Error"
            );
            const Button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
              .setLabel("نعم")
              .setStyle(ButtonStyle.Success)
              .setCustomId(`runcommand_${bestMatch.word}_${message.id}`));
            
              if(Embed) {
        const msg = await message.reply({
              embeds: [Embed],
              components: [Button]
            });
            setTimeout(async function() {
              await msg.delete().catch(e => {});
            }, 5000)
          }
        
        }
        }
        } else {
        const { colldowns } = this.client;

        if (!colldowns.has(command.name)) {
          colldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = colldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (
          timestamps.has(message.author.id) &&
          now < timestamps.get(message.author.id)! + cooldownAmount
        ) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `❌ يرجى الصبر لمدة \`${(
                    (timestamps.get(message.author.id)! +
                      cooldownAmount -
                      now) /
                    1000
                  ).toFixed(1)}\` ثانيه لتشغيل الأمر`
                ),
            ],
          });
        }

        timestamps.set(message.author.id, now);
        setTimeout(function() {
          timestamps.delete(message.author.id)
        }, cooldownAmount);
        
          const findRoleEvent = await schemaRoleEvent.findOne({
            guildId: message.guild?.id,
            channelId: message.channel.id,
          });
          const findCommandDisable = await SchemaCommandControl.findOne({
            guildId: message.guild?.id
          });


        await SchemaServerUsedStats.findOneAndUpdate(
          {
            guildId: message.guild?.id,
          },
          {
            $inc: { statsall: 1, [`commands.${command.name}`]: 1}
          },
          {
            upsert: true, new: true
          }
        );

          if(findCommandDisable) {
            if(findCommandDisable.command.includes('all')) {
              return;
            } else if(findCommandDisable.command.includes('one')) {
              if(command.category === Category.فرديه) {
                return;
              }
            } else if(findCommandDisable.command.includes('two')) {
              if(command.category === Category.ثنائيه) {
                return;
              }
            } else if(findCommandDisable.command.includes('three')) {
              if(command.category === Category.مجموعه) {
                return;
              }
            } else if(findCommandDisable.command.includes('all')) {
              return;
            } else if(findCommandDisable.command.includes(command.name)) {
                return;
              }
            }
          

          if (findRoleEvent) {
            const findRole = message.member?.roles.cache.some((role) =>
              findRoleEvent?.roleId.includes(role.id)
            );

            if (!findRole) {
              if(findRoleEvent.command === "all") {
                return;
           } else if(findRoleEvent.command === 'one') {
              if(command.category === Category.فرديه) {
                return;
              } else {
                await command.execute(message);
              }
            } else if(findRoleEvent.command === 'two') {
              if(command.category === Category.ثنائيه
              ) {
                return;
              } else {
                await command.execute(message);
              }
            }
           } else {
              await command.execute(message);
            }
        } else {
          await command.execute(message);
        }
      }
     }
     }
     }
     } catch (err: any) {
console.log("err help sos", err)
        message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `❌ قد واجتنها مشكله: ${err.message}`
                ),
            ],
          });
     }
    }
  }