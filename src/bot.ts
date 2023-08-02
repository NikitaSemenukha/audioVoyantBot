// bot.ts
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { StartCommandHandler, RecordCommandHandler, HelloCommandHandler, DefaultCommandHandler, CommandHandler } from './core/commands/commands.handler';
import { Database } from './db/db';

// Загрузка переменных среды из файла .env
require('dotenv').config();

// Ваш токен Telegram бота
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

export default class MyTelegramBot {
  private bot: TelegramBot;
  private db: Database;

  constructor() {
    if (telegramToken) {
      this.bot = new TelegramBot(telegramToken, { polling: true });
      this.db = new Database();
      
      this.init();
    } else {
      console.error('Ошибка: Токен Telegram бота не найден. Пожалуйста, добавьте его в файл .env.');
      process.exit(1);
    }
  }

  private async init() {

      const me = await this.bot.getMe();
      const botName = `@${me.username}`;
      console.log(`Бот ${me.first_name} (${botName}) запущен.`);
  
      // Отправляем команду /start автоматически
      this.sendMessageToUser(me.id, '/start');
  
      this.bot.on('message', this.handleMessage.bind(this));
  }

  public sendMessage(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }

  private sendMessageToUser(userId: number, message: string) {
    this.bot.sendMessage(userId, message);
  }

  private handleMessage(msg: Message) {
    // Разбор команды
    const command = msg.text ? msg.text.split(' ')[0] : '';
    const commandHandler = this.getCommandHandler(command);
    commandHandler.handle(this, msg); // Передаем this (MyTelegramBot) как первый аргумент
  }

  private getCommandHandler(command: string): CommandHandler {
    switch (command) {
      case '/start':
        return new StartCommandHandler();
      case '/record':
        return new RecordCommandHandler();
      case '/hello':
        return new HelloCommandHandler();
      default:
        return new DefaultCommandHandler();
    }
  }
}
