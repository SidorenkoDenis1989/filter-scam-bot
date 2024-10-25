const TelegramBot = require('node-telegram-bot-api');
const { startCommand } = require('./commands/start');
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Commands handler
bot.onText(/\/start/, startCommand);

module.exports = { bot };
