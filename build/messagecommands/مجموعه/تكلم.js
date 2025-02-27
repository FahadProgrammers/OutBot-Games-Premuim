"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const node_gtts_1 = __importDefault(require("node-gtts"));
const stream_1 = require("stream");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const words_json_1 = __importDefault(require("../../utils/games/words.json"));
const MessageCollecter_1 = __importDefault(require("../../utils/functions/MessageCollecter"));
// تحديد مسار ffmpeg
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
class Speak extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "تكلم",
            description: "يتم تشغيل صوت بكلمة معينة، يجب أن يكون هناك شخصان على الأقل في القناة الصوتية.",
            category: Category_1.default.مجموعه,
            cooldown: 3,
            aliases: ["صوت", "يتكلم", "تشغيل"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
                if (!voiceChannel) {
                    return message.reply("❌ يجب أن تكون في قناة صوتية لاستخدام هذا الأمر.");
                }
                if (voiceChannel.members.size < 2) {
                    return message.reply("❌ يجب أن يكون هناك شخصان على الأقل في القناة.");
                }
                const text = words_json_1.default.words[Math.floor(Math.random() * words_json_1.default.words.length)];
                const lang = "ar";
                const tts = (0, node_gtts_1.default)(lang);
                const ttsStream = tts.stream(text);
                const buffers = [];
                ttsStream.on("data", (chunk) => buffers.push(chunk));
                ttsStream.on("end", () => {
                    var _a, _b;
                    const audioBuffer = Buffer.concat(buffers);
                    const convertedStream = (0, fluent_ffmpeg_1.default)()
                        .input(stream_1.Readable.from(audioBuffer))
                        .audioCodec("libopus")
                        .format("opus")
                        .pipe();
                    const audioResource = (0, voice_1.createAudioResource)(convertedStream, {
                        inputType: voice_1.StreamType.OggOpus,
                    });
                    const player = (0, voice_1.createAudioPlayer)();
                    player.play(audioResource);
                    const time_1 = Date.now();
                    const connection = (0, voice_1.joinVoiceChannel)({
                        guildId: ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id) || "",
                        channelId: voiceChannel.id,
                        adapterCreator: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.voiceAdapterCreator,
                    });
                    connection.subscribe(player);
                    message.reply(`🎤 يتم تشغيل: **"${text}"** في القناة الصوتية.`);
                    player.on(voice_1.AudioPlayerStatus.Idle, () => __awaiter(this, void 0, void 0, function* () {
                        connection.destroy();
                        yield (0, MessageCollecter_1.default)(this.client, message, text, time_1);
                    }));
                    player.on("error", (error) => {
                        console.error("❌ خطأ أثناء تشغيل الصوت:", error);
                        message.reply("❌ حدث خطأ أثناء تشغيل الصوت.");
                    });
                });
            }
            catch (error) {
                console.error("❌ خطأ أثناء تشغيل الصوت:", error);
                message.reply("❌ حدث خطأ أثناء تشغيل الصوت.");
            }
        });
    }
}
exports.default = Speak;
