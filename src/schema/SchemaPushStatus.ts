import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
});

export default model<SchemaType>("Push-Tester", schema2);
