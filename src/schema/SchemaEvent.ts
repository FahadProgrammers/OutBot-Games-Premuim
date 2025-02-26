import { model, Schema } from 'mongoose';

interface SchemaType {
    guildId: string;
    command: string;
    roleId: string;
    channelId: string
}

const schema2 = new Schema<SchemaType>({
    guildId: { type: String, required: true }, 
    channelId: { type: String, required: true },
    roleId: { type: String, required: true },
    command: { type: String, required: true }
});

export default model<SchemaType>("RoleEvent-prem", schema2);
