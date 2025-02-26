import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    channelId: string[];
    time: number;
    date: Date;
    dateend: Date;
}

const schema2 = new Schema<schema>({
guildId: String,
channelId: Array,
time: { type: Number, require: false },
date: { type: Date, default: Date.now() },
dateend: { type: Date, default: Date.now(), required: false }
});

export default model<schema>("channel-prem", schema2);