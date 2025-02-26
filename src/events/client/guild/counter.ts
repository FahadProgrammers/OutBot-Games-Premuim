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
import SchemaCounter from "../../../schema/SchemaCounter";
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
      description: "MessageCreate Counter",
      once: false,
    });
  }
  async execute(message: Message) {
    if (!message.content || typeof message.content !== "string" || !message.guild) {
      return;
    }
    try {
              const channelData = await SchemaCounter.findOne({ guildId: message.guild?.id, channelId: message.channel.id });
              if (!channelData) return;
                        const count = channelData.count;
      
                  if (parseInt(message.content) === count + 1) {
                      await SchemaCounter.updateOne({ guildId: message.guild?.id, channelId: message.channel.id }, { count: count + 1 });
                  } else {
                    if(message.author.id === this.client.user?.id) {
                      return;
                    }
                    if(channelData.roleId) {
                      const user = await this.client.guilds.cache.get(message.guild.id)?.members.cache.get(message.author.id);
                      if(user) {
                        if(user.roles.cache.some(r => r.id === channelData.roleId)) {
                          return;
                        }
                      }
                    };
              
                      await message.delete().catch(() => {});
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