import { EmbedBuilder, GuildMember } from "discord.js";

export default function mainembed(
    des: string | undefined,
    footer?: string | null,
    fields?: string | null,
    member?: GuildMember
) {
    const embed = new EmbedBuilder()
        // .setDescription(des ? des : "ㅤ")
        .setTimestamp()
        .setColor('Red');

    if (footer) {
        embed.setFooter({
            text: `OutBot Games - ${footer}`,
            iconURL: member?.user ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}` : undefined
        });
    }

    embed.setAuthor({
        name: `OutBot Games - ${fields ? fields : "Game"}`,
        iconURL: member?.user ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}` : undefined
    });

    return embed;
}
