import { EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";

export default function mainembed(des: string, footer?: string | null, fields?: string | null) {
return new EmbedBuilder()
.setDescription(des)
.setTimestamp()
.setFooter({
    text: `OutBot Games - ${footer ? footer : "Game"}`,
    iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
})
.setColor('Red')
.setAuthor({
    name: `OutBot Games - ${fields ? fields : "Game"}`,
    iconURL: "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&"
})
}
