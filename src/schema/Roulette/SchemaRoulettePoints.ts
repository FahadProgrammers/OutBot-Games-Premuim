import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    userId: string; 
    p: number; 
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    userId: { type: String, required: true }, 
    p: { type: Number, required: true } 
});

export default model<SchemaType>("RoulettePointsTester", schema2);
