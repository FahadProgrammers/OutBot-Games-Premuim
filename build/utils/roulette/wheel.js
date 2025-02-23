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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRouletteGame = exports.createWheel = exports.createSpinWheel = void 0;
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const roulette_image_1 = require("roulette-image");
const loadImageWithFallback = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, canvas_1.loadImage)(url);
    }
    catch (error) {
        console.error(`Failed to load image from ${url}, using fallback image.`);
        return yield (0, canvas_1.loadImage)("https://cdn.discordapp.com/attachments/1225977975644618872/1316381967897591838/fallback.png?ex=675ad7be&is=6759863e&hm=7b0786116a91b4a13aaa977af0c1c71c45223da77a77a1b57174b31cb9bd793c&");
    }
});
const createSpinWheel = (data, returnCanvas) => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = (0, canvas_1.createCanvas)(1080, 1080);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 450;
    const innerRadius = 100;
    const colors = [
        ['#FF5F6D', '#FFC371'], // Sunset
        ['#24C6DC', '#514A9D'], // Ocean Blue
        ['#DA22FF', '#9733EE'], // Purple
        ['#F7971E', '#FFD200'], // Orange
        ['#56CCF2', '#2F80ED'], // Blue
        ['#43C6AC', '#F8FFAE'], // Green
        ['#EECDA3', '#EF629F'], // Pink
        ['#7F00FF', '#E100FF'], // Violet
        ['#FF512F', '#DD2476'], // Red
        ['#1FA2FF', '#12D8FA'], // Sky Blue
    ];
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#333333';
    ctx.fill();
    const totalSegments = data.length;
    const angleStep = (2 * Math.PI) / totalSegments;
    for (let i = 0; i < totalSegments; i++) {
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = startAngle + angleStep;
        const color = colors[i % colors.length];
        const gradient = ctx.createLinearGradient(centerX + Math.cos(startAngle) * innerRadius, centerY + Math.sin(startAngle) * innerRadius, centerX + Math.cos(endAngle) * outerRadius, centerY + Math.sin(endAngle) * outerRadius);
        gradient.addColorStop(0, color[0]);
        gradient.addColorStop(1, color[1]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px PoppinsBold';
        const label = data[i].label;
        const maxTextWidth = outerRadius - innerRadius - 40;
        wrapText(ctx, label, (outerRadius + innerRadius) / 2, 0, maxTextWidth, 36);
        ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#222222';
    ctx.fill();
    const glossGradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
    glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = glossGradient;
    ctx.fill();
    if (returnCanvas)
        return canvas;
    return canvas.toBuffer('image/png');
});
exports.createSpinWheel = createSpinWheel;
const createWheel = (data, userAvatar) => __awaiter(void 0, void 0, void 0, function* () {
    const winnerIndex = data.findIndex((item) => item.winner);
    const rotatedData = [...data.slice(winnerIndex), ...data.slice(0, winnerIndex)];
    const spinwheel = yield (0, exports.createSpinWheel)(rotatedData, true);
    const canvas = (0, canvas_1.createCanvas)(1080, 1080);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 450;
    const innerRadius = 100;
    ctx.save();
    ctx.translate(centerX, centerY);
    const angleStep = (2 * Math.PI) / data.length;
    ctx.rotate(-angleStep / 2);
    ctx.drawImage(spinwheel, -centerX, -centerY);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 20, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFD700';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 10, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFD700';
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 15, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#333333';
    ctx.fill();
    ctx.clip();
    const userImage = yield loadImageWithFallback(userAvatar);
    ctx.drawImage(userImage, centerX - (innerRadius - 15), centerY - (innerRadius - 15), (innerRadius - 15) * 2, (innerRadius - 15) * 2);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 15, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFD700';
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const pointer = yield (0, canvas_1.loadImage)("https://cdn.discordapp.com/attachments/1225977975644618872/1316381574761287740/pointer.png?ex=675ad760&is=675985e0&hm=a113ae11a859ce86e1aba2170c813487ccc2c057c0521041468af2ab35b9ab4c&");
    ctx.save();
    ctx.translate(centerX, centerY - outerRadius - 40);
    ctx.drawImage(pointer, -40, -40, 80, 80);
    ctx.restore();
    return canvas.toBuffer('image/png');
});
exports.createWheel = createWheel;
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        }
        else {
            line = testLine;
        }
    }
    lines.push(line);
    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2 + lineHeight / 2;
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, startY + i * lineHeight);
    }
}
const startRouletteGame = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Starting roulette game...");
        // Define the available colors for the roulette wheel
        const colorsGradient = ['#32517f', '#4876a3', '#5d8ec7', '#74a6eb', '#8ac0ff'];
        // Example options for players, you can adjust this to fetch users dynamically
        const options = [{
                user: 'd', // Replace with actual user information
                label: "._f99",
                color: colorsGradient[Math.floor(Math.random() * colorsGradient.length)], // Random color
            }];
        // Randomize winner selection based on available options
        const winnerIndex = Math.floor(Math.random() * options.length); // Random index for winner
        const winnerOption = options[winnerIndex];
        console.log("Winner selected:", winnerOption);
        // Generate the roulette wheel image
        const sectors = [
            { number: 0, username: 'User1', color: '#FF0000', avatarURL: 'https://cdn.discordapp.com/attachments/1299471640698028073/1316383032357158973/wheel.gif?ex=675ad8bc&is=6759873c&hm=9b688156672a218ca767f94fa60b9108d63e27b93a904d97e147a73ff66510ec&' },
            { number: 1, username: 'User2', color: '#00FF00', avatarURL: 'https://cdn.discordapp.com/attachments/1299471640698028073/1316383032357158973/wheel.gif?ex=675ad8bc&is=6759873c&hm=9b688156672a218ca767f94fa60b9108d63e27b93a904d97e147a73ff66510ec&' },
            // Add more sectors...
        ];
        const gifBuffer = yield (0, roulette_image_1.createRouletteGifImage)(sectors);
        if (message.channel instanceof discord_js_1.TextChannel) {
            yield message.channel.send({
                files: [{ attachment: gifBuffer, name: "roulette.gif" }],
                content: `Congratulationsssssssssss 🎉 you won`
            });
        }
    }
    catch (err) {
        console.error("Error in starting roulette game:", err);
    }
});
exports.startRouletteGame = startRouletteGame;
