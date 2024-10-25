module.exports.startCommand = (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hi! I'm your bot.`);
};