import { EmbedBuilder } from "discord.js";

export default function mainembed(des: string, guildName: string | undefined, guildURL: string | null | undefined) {
return new EmbedBuilder()
.setDescription(des)
.setTimestamp()
.setColor('Red')
.setFooter({
    text: `OutBot Games - ${guildName ? guildName : "Game"}`,
    iconURL: guildURL ?? "https://cdn.discordapp.com/attachments/1299697533207183381/1299700733314207775/fgfgdgj.png?ex=671e2822&is=671cd6a2&hm=f577515043ddb9b8ab589271b3f3ff40ab1e701ab5e1dbb863699005282310b2&",
})
}