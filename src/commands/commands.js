const startHandler = (bot) => {
  return (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Hi, I'm your bot2`);
  };
}

const messageHandler = (bot) => {
  return (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text) {
      bot.sendMessage(chatId, `Your wrote2: ${text}`);
    }
  };
}

module.exports = {
  startHandler,
  messageHandler,
};