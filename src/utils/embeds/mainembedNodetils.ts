import { EmbedBuilder } from "discord.js";

export default function mainembed(des: string) {
return new EmbedBuilder()
.setDescription(des)
.setColor('Red')
}