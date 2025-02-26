import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    command: string[];
}

const schema2 = new Schema<schema>({
guildId: String,
command: Array,
});

export default model<schema>("command-prem", schema2);