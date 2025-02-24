import { model, Schema } from 'mongoose';


interface SchemaType {
    guildId: string;
    statsall: number;
    commands: Record<string, number>;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true, unique: true }, 
    statsall: { type: Number, required: true, default: 0 },
    commands: { type: Map, of: Number, default: {} }
});

export default model<SchemaType>("ServerUsedStats", schema2);
