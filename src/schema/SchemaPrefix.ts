import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    prefix: string[];
    channelId: String;
    date: Date;
}

const schema2 = new Schema<schema>({
guildId: String,
prefix: Array,
channelId: { type: String, required: true },
date: { type: Date, default: Date.now() },
});

export default model<schema>("prefix-prem", schema2);