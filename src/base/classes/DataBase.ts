import IDataBase from '../interfaces/IDataBase';
import CustomClient from './CustomClient';
import mongoose from 'mongoose';
import colors from 'colors'
import * as dotenv from "dotenv";

dotenv.config();
export default class DataBase implements IDataBase
{
    url!: string;
    async connect(client: CustomClient) {


    const mongoUrl = process.env.mongourl;
    if (!mongoUrl) {
        throw new Error("MongoDB connection URL is not defined in environment variables");
    }
    mongoose.connect(mongoUrl).then(() => {
        console.log(colors.underline('[DataBase MongoDB]').green + " ﺕﺎﻧﺎﻴﺒﻟﺍ ﺓﺪﻋﺎﻗ ﻂﺑﺭ ﺡﺎﺠﻨﺑ ﻢﺗ")
    }).catch(err => {
        console.log(colors.underline('[DataBase MongoDB]').red + "ﺕﺎﻧﺎﻴﺒﻟﺍ ﺓﺪﻋﺎﻗ ﻝﺎﺼﺗﺍ ﻞﺸﻓ")
    })


    }
}