const scamDetectorService = require('../service/scam-detector');

const startHandler = (bot) => {
  return (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Hi, I'm your bot`);
  };
}

const messageHandler = (bot) => {
  return async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    const isSpam = await scamDetectorService.isSpamMessage(text);
    console.log("isSpam", isSpam);
    if (isSpam) {
      await bot.deleteMessage(chatId, msg.message_id)
        .then(() => console.log(`Удалено спам-сообщение: "${text}"`))
        .catch((err) => console.error(`Ошибка удаления: ${err.message}`));
    } else {
      console.log(`Сообщение нормально: "${text}"`);
    }
  };
}

module.exports = {
  startHandler,
  messageHandler,
};