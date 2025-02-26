import { EmbedBuilder, Guild, ColorResolvable } from "discord.js";
import utils from "../../utils/utils";
import emoji from "../functions/emojis";
import SchemaEmbed from "../../schema/SchemaEmbedColor";
import CustomClient from "../../base/classes/CustomClient";

interface EmbedObject {
    title?: string;
    des?: string;
    line: boolean;
    footer?: string | null;
    fields?: string | null;
}

export default async function BaseEmbed(
    client: CustomClient,
    GuildiObject: Guild,
    EmbedObject: EmbedObject,
    embedType: string
) {
    try {
        let Embed = new EmbedBuilder();
        let { title, des, line, footer, fields } = EmbedObject;

        let color: ColorResolvable = "Red";
        const find = await SchemaEmbed.findOne({ guildId: GuildiObject.id });
        if (find) {
            color = find.embedcolor as ColorResolvable;
        }

        if (line) {
            Embed.setImage(utils.Line);
        }

        switch (embedType) {
            case "Base":
                if (title) {
                    Embed.setTitle(`${GuildiObject.name} - ${title ? `${title}` : ""}`);
                }
                if (des) {
                    Embed.setDescription(des);
                }
                Embed.setAuthor({
                    name: `${GuildiObject.name} - ${fields || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setFooter({
                    text: `${GuildiObject.name} - ${footer || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setColor(color)
                .setThumbnail(GuildiObject.iconURL() || emoji.BaseURL)
                .setTimestamp();
                break;

            case "Success":
                Embed.setDescription(des || "ERR")
                .setColor("Green")
                .setAuthor({
                    name: `${GuildiObject.name} - ${fields || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setFooter({
                    text: `${GuildiObject.name} - ${fields || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setThumbnail(emoji.trueURL)
                .setTimestamp();
                break;

            case "Error":
                Embed.setDescription(des || "ERR")
                .setColor("Red")
                .setAuthor({
                    name: `${GuildiObject.name} - ${fields || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setFooter({
                    text: `${GuildiObject.name} - ${fields || "Bot"}`,
                    iconURL: GuildiObject.iconURL() || emoji.BaseURL,
                })
                .setThumbnail(emoji.falseURL)
                .setTimestamp();
                break;

            default:
                throw new Error("Invalid embedType provided.");
        }

        return Embed;
    } catch (err) {
        console.error("Error in BaseEmbed:", err);
        return null;
    }
}
