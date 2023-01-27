const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const token = '5885399310:AAFSUqjDlN4vZibWyfFmN7umOBqEIE5v47I';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `I'll think a number from 0 to 9 and you guess it`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'lets guess!!!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'initial greeting' },
    { command: '/info', description: 'information about user' },
    { command: '/game', description: 'game - guess a number' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(chatId + ': ' + text);
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/69c/216/69c21694-1f7c-441e-a166-9ca08496ed03/192/4.webp');
      return bot.sendMessage(chatId, `Hello my dear friend!!!`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is: ${msg.chat.first_name} ${msg.chat.last_name}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Try again, I don`t understand you');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `YES!!!!!!!!!! it is ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `NOT. the number is ${chats[chatId]}`, againOptions);
    }

    //console.log(msg);
    //bot.sendMessage(chatId, `You chose ${data} or ${chats[chatId]}?`);
  });
};

start();
