import IDataBase from '../interfaces/IDataBase';
import CustomClient from './CustomClient';
import mongoose from 'mongoose';
import colors from 'colors'

export default class DataBase implements IDataBase
{
    url!: string;
    async connect(client: CustomClient) {


        mongoose.connect(client.config.mongourl).then(() => {
     console.log(colors.underline('[DataBase MongoDB]').green + " ﺕﺎﻧﺎﻴﺒﻟﺍ ﺓﺪﻋﺎﻗ ﻂﺑﺭ ﺡﺎﺠﻨﺑ ﻢﺗ")
        }).catch(err => {
     console.log(colors.underline('[DataBase MongoDB]').red + "ﺕﺎﻧﺎﻴﺒﻟﺍ ﺓﺪﻋﺎﻗ ﻝﺎﺼﺗﺍ ﻞﺸﻓ")
        })


    }
}