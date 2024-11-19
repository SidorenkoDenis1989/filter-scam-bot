const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hi, I'm your test bot!`);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text) {
    bot.sendMessage(chatId, `You have written: ${text}`);
  }
});