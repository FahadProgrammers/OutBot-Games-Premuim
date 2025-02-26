import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
  TextChannel,
  time,
} from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Events";
import Command from "../../../base/classes/Command";
import schema from "../../../schema/SchemaPremuim";
import moment from "moment";

export default class PremuimHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Command Handler Event",
      once: false,
    });
  }
  async execute(client: CustomClient) {
    setInterval(async () => {
      let find = await schema.find();
      if (!find) return;
      for (let entry of find) {
        if (moment().isAfter(moment(entry.time))) {
          try {
            const guild = await client.guilds.cache.get(entry?.guildId);
            guild?.leave();
            const user = await client.users.cache.get(entry?.owner);
            const channel = await client.channels.cache.get(
              "1306088477875507270"
            );
            user?.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `<:Arrow1:1299711671052402718>  إنتهاء الاشتراك

لقد انتهى اشتراكك نتمنى لك وقت استمتعت فيه بالبوت وشكرا ل دعمنا!
`
                  )
                  .setTimestamp()
                  .setFooter({
                    text: `${guild?.name} - System`,
                    iconURL: guild?.iconURL() || undefined,
                  })
                  .setColor("Red")
                  .setAuthor({
                    name: `${guild?.name} - System`,
                    iconURL: guild?.iconURL() || undefined,
                  }),
              ],
            });

            if (channel instanceof TextChannel) {
              channel?.send({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `<:Arrow1:1299711671052402718>  إنتهاء الاشتراك

### معلومات المستخدم

ايدي المالك : \`${entry?.owner}\`
اشترك منذ ( ممكن تقريبا ): <t:${Math.floor(entry.starttime.getTime() / 1000)}:R>
انتهى منذ ( ممكن تقريبا ):<t:${Math.floor(entry.time.getTime() / 1000)}:R>
`
                    )
                    .setTimestamp()
                    .setFooter({
                      text: `${guild?.name} - System`,
                      iconURL: guild?.iconURL() || undefined,
                    })
                    .setColor("Red")
                    .setAuthor({
                      name: `${guild?.name} - System`,
                      iconURL: guild?.iconURL() || undefined,
                    }),
                ],
              });
              await schema.deleteOne({
                guildId: entry.guildId,
                time: entry.time,
                starttime: entry.starttime,
                owner: entry.owner,
                token: entry.token,
              });
            }
          } catch (error) {
            return console.log(error);
          }
        }
      }
    }, 60000);
  }
}
