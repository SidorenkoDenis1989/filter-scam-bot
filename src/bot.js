const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./config');
const commands = require('./commands/commands');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const data = JSON.parse(fs.readFileSync('train-model/data.json', 'utf-8'));

bot.onText(/\/start/, commands.startHandler(bot));
bot.on('message', commands.messageHandler(bot));

module.exports = bot;