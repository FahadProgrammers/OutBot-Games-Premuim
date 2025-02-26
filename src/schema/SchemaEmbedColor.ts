import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    embedcolor: string;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    embedcolor: { type: String, required: true },
});

export default model<SchemaType>("embed-color-prem", schema2);
