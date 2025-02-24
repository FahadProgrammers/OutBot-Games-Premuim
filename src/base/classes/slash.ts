import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
import CustomClient from './CustomClient';
import colors  from 'colors';
import Command from './Command';
import * as dotenv from "dotenv";

dotenv.config();
export default class slash
{
    async load(client: CustomClient): Promise<void> {
        const clientId = client.devlopmentMode ? process.env.devclientId : process.env.clientId;
        const guildId = client.devlopmentMode ? process.env.devguildId : process.env.guildId;
        const token = client.devlopmentMode ? process.env.devtoken : process.env.token;
        
            const commands: object[] = this.GetJson(client.commands);
        
            if (!token) {
                throw new Error("Token is undefined");
            }
            const rest = new REST().setToken(token);
        
            if (!clientId || !guildId) {
                throw new Error("Client ID or Guild ID is undefined");
            }
            const setCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            });
            console.log(colors.underline("[REST API] ").green + `Successfully set ${setCommands.length} commands!`)
        }
            private GetJson(commands: Collection<string, Command>): object[] {
                const data: object[] = [];
                commands.forEach(command => {
                    data.push({
                        name: command.data.name,
                        command: command
                    });
                });
                return data;
}
}