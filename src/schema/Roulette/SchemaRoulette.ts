import { model, Schema } from "mongoose";

interface schema {
  guildId: string;
  channelId: string;
  dobule?: boolean;
  dobuleUsed?: boolean;
  players: {
    security?: boolean;
    securityUsed?: boolean;
    cancel?: boolean;
    cancelUsed?: boolean;
    winner?: boolean;
    user: any;
    username: string;
    userId: string;
    number: number;
    image: string;
  }[];
  msgId: string;
}

const schema2 = new Schema<schema>({
  guildId: String,
  channelId: String,
  dobule: {
    type: Schema.Types.Boolean,
    require: false,
  },
  dobuleUsed: {
    type: Schema.Types.Boolean,
    require: false,
  },
  players: [
    {
      winner: {
        type: Schema.Types.String,
        require: false,
      },
      security: {
        type: Schema.Types.Boolean,
        require: false,
      },
      securityUsed: {
        type: Schema.Types.Boolean,
        require: false,
      },

      cancel: {
        type: Schema.Types.Boolean,
        require: false,
      },
      cancelUsed: {
        type: Schema.Types.Boolean,
        require: false,
      },
      user: {
        type: Schema.Types.Mixed,
        require: true /* unique: true */,
      },
      username: {
        type: Schema.Types.String,
        require: true,
      },
      userId: {
        type: Schema.Types.String,
        require: true,
      },
      number: {
        type: Schema.Types.Number,
        require: true,
      },
      image: {
        type: Schema.Types.String,
        require: true,
      },
      
    },
  ],
  msgId: String,
});

export default model<schema>("roulette-prem", schema2);
