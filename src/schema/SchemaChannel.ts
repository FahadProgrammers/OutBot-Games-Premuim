import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    channelId: string[];
    date: Date;
}

const schema2 = new Schema<schema>({
guildId: String,
channelId: Array,
date: { type: Date, default: Date.now() },
});

export default model<schema>("channel-Tester", schema2);