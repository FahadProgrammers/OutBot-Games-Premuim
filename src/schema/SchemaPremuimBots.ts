import { model, Schema } from 'mongoose';

interface SchemaType {
    botId: string;
    token: string;
    own: boolean;
}

const schema2 = new Schema<SchemaType>({
    botId: { type: String, required: true }, 
    token: { type: String, required: true },
    own: { type: Boolean, required: true }
});

export default model<SchemaType>("PremuimBots", schema2);
