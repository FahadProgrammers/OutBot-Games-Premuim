import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  DiscordGatewayAdapterCreator,
} from "@discordjs/voice";
import { Message } from "discord.js";
import Command from "../../base/classes/MessageCreate";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import gtts from "node-gtts";
import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import randomwords from "../../utils/games/words.json";
import Collecter from "../../utils/functions/MessageCollecter";

// تحديد مسار ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

export default class Speak extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "تكلم",
      description:
        "يتم تشغيل صوت بكلمة معينة، يجب أن يكون هناك شخصان على الأقل في القناة الصوتية.",
      category: Category.مجموعه,
      cooldown: 3,
      aliases: ["صوت", "يتكلم", "تشغيل"],
    });
  }

  async execute(message: Message) {
    try {
      const voiceChannel = message.member?.voice.channel;
      if (!voiceChannel) {
        return message.reply("❌ يجب أن تكون في قناة صوتية لاستخدام هذا الأمر.");
      }

      if (voiceChannel.members.size < 2) {
        return message.reply("❌ يجب أن يكون هناك شخصان على الأقل في القناة.");
      }

      const text =
        randomwords.words[Math.floor(Math.random() * randomwords.words.length)];
      const lang = "ar";
      const tts = gtts(lang);

      const ttsStream = tts.stream(text);
      const buffers: Buffer[] = [];

      ttsStream.on("data", (chunk: Buffer) => buffers.push(chunk));
      ttsStream.on("end", () => {
        const audioBuffer = Buffer.concat(buffers);

        const convertedStream = ffmpeg()
          .input(Readable.from(audioBuffer))
          .audioCodec("libopus")
          .format("opus")
          .pipe();

        const audioResource = createAudioResource(convertedStream, {
          inputType: StreamType.OggOpus, 
        });

        const player = createAudioPlayer();
        player.play(audioResource);
        const time_1 = Date.now();


        const connection = joinVoiceChannel({
          guildId: message.guild?.id || "",
          channelId: voiceChannel.id,
          adapterCreator: message.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });

        connection.subscribe(player);

        message.reply(`🎤 يتم تشغيل: **"${text}"** في القناة الصوتية.`);

        player.on(AudioPlayerStatus.Idle, async () => {
          connection.destroy();
          await Collecter(this.client, message, text, time_1);
        });

        player.on("error", (error) => {
          console.error("❌ خطأ أثناء تشغيل الصوت:", error);
          message.reply("❌ حدث خطأ أثناء تشغيل الصوت.");
        });
      });
    } catch (error) {
      console.error("❌ خطأ أثناء تشغيل الصوت:", error);
      message.reply("❌ حدث خطأ أثناء تشغيل الصوت.");
    }
  }
}
