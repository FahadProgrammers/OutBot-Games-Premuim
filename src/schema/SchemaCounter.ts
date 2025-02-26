import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    channelId: string;
    roleId: string;
    count: number;
}

const schema2 = new Schema<schema>({
guildId: String,
channelId: String,
roleId: { type: String, require: false },
count: { type: Number, require: false, default: 0 },
});

export default model<schema>("counter-prem", schema2);