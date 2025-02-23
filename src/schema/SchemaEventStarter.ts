import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    channel?: string;
    commands: string[] | undefined;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    channel: { type: String, required: false },
    commands: { type: Array, required: true }
});

export default model<SchemaType>("Event-Tester", schema2);
