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
const MessageCreate_1 = __importDefault(require("../../base/classes/MessageCreate"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const mainEmbed_1 = __importDefault(require("../../utils/embeds/mainEmbed"));
const Profile_1 = __importDefault(require("../../utils/functions/Profile"));
class help extends MessageCreate_1.default {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "إضهار المعلومات",
            category: Category_1.default.ادمن,
            cooldown: 3,
            aliases: ["بروفايل"],
        });
    }
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const waitembed = (0, mainEmbed_1.default)("يرجى الإنتضار...", "Profile", "Profile");
            const msg = yield message.reply({
                embeds: [waitembed],
            });
            const profileembed = (0, mainEmbed_1.default)("البروفايل الخاص بك.", "Profile", "Profile");
            const profileBuffer = (yield (0, Profile_1.default)(message));
            profileembed.setImage("attachment://file.jpg");
            yield msg.edit({
                embeds: [profileembed],
                files: [profileBuffer],
            });
        });
    }
}
exports.default = help;
