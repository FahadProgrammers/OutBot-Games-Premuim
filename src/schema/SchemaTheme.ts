import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    theme: string;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    theme: { type: String, required: true },
});

export default model<SchemaType>("theme-prem", schema2);
