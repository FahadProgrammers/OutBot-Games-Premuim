import { model, Schema } from 'mongoose'

interface schema {
    guildId: string;
    userId: string;
}

const schema2 = new Schema<schema>({
guildId: String,
userId: String,
});

export default model<schema>("ramdan", schema2);