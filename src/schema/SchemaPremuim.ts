import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    time: Date; 
    starttime: Date;
    owner: string;
    token: string;
    botId: string;
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    time: { type: Date, required: true },
    starttime: { type: Date, required: true },
    owner: { type: String, required: true },
    botId: { type: String, required: false },
    token: { type: String, required: false }
});

export default model<SchemaType>("Premuim", schema2);
