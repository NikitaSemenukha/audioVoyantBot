// commandHandlers.ts
import { Message } from 'node-telegram-bot-api';
import MyTelegramBot from '../../bot';
import { Database } from '../../db/db';


export interface CommandHandler {
  handle(bot: MyTelegramBot, msg: Message): void;
}

export class StartCommandHandler implements CommandHandler {
  async handle(bot: MyTelegramBot, msg: Message) {
    const response = 'Привет! Я - простейший Telegram бот. Введите /hello, чтобы получить приветственное сообщение.';
    bot.sendMessage(msg.chat.id, response);

    // Сохраняем chatId в базу данных при получении команды /start
    await this.saveChatIdToDatabase(msg.chat.id);
  }

  // Функция для сохранения chatId в базу данных
  private async saveChatIdToDatabase(chatId: number) {
    const db = new Database();
    await db.connect();

    try {
      const collection = db.usersInfo;
      const document = { chatId: chatId };
      await collection.insertOne(document);
      console.log(`ChatId ${chatId} успешно сохранен в базе данных.`);
    } catch (error) {
      console.error('Ошибка при сохранении chatId:', error);
    } finally {
      db.close(); // Закрываем соединение с базой данных
    }
  }
}

export class RecordCommandHandler implements CommandHandler {
  handle(bot: MyTelegramBot, msg: Message) {
    const response = 'Запишите голосовое сообщение или предоставьте его в текстовой форме.';
    bot.sendMessage(msg.chat.id, response);
    console.log('Получена команда /record.');
    // Здесь можно добавить логику для обработки команды /record
  }
}

export class HelloCommandHandler implements CommandHandler {
  handle(bot: MyTelegramBot, msg: Message) {
    const response = 'Привет! Добро пожаловать!';
    bot.sendMessage(msg.chat.id, response);
    console.log('Получена команда /hello.');
    // Здесь можно добавить логику для обработки команды /hello
  }
}

export class DefaultCommandHandler implements CommandHandler {
  handle(bot: MyTelegramBot, msg: Message) {
    const text = msg.text ?? '';
    const response = `Вы ввели следующий текст: "${text}"`;
    // Здесь можно добавить логику для обработки неизвестных команд
    bot.sendMessage(msg.chat.id, response);
  }
}
