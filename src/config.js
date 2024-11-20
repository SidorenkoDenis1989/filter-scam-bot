require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error(`BOT_TOKEN wasn't found inside .env`);
}

module.exports = {
  BOT_TOKEN,
};