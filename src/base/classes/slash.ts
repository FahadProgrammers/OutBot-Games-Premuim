import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
import CustomClient from './CustomClient';
import colors  from 'colors';
import Command from './Command';
export default class slash
{
    async load(client: CustomClient): Promise<void> {
        const clientId = client.devlopmentMode ? client.config.devclientId : client.config.clientId;
        const guildId = client.devlopmentMode ? client.config.devguildId : client.config.guildId;
        const token = client.devlopmentMode ? client.config.devtoken : client.config.token;
        
            const commands: object[] = this.GetJson(client.commands);
        
            const rest = new REST().setToken(token);
        
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