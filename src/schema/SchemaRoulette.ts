import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    channelId: string;
    players: any[]
}

const schema2 = new Schema<schema>({
guildId: String,
channelId: String,
players: Array
});

export default model<schema>("rouletteGame-Tester", schema2);