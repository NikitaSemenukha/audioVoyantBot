// commandHandlers.ts
import { Message } from 'node-telegram-bot-api';
import MyTelegramBot from '../../bot';
import { Database } from '../../db/db';
import { DbWriter } from '../../db/db.writer.abstract';
import { MyDbWriter } from '../../db/db.writer';


export interface CommandHandler {
  handle(bot: MyTelegramBot, msg: Message): void;
}

export class StartCommandHandler implements CommandHandler {
  async handle(bot: MyTelegramBot, msg: Message) {
    const response = 'Привет! Я - простейший Telegram бот. Введите /hello, чтобы получить приветственное сообщение.';
    bot.sendMessage(msg.chat.id, response);
    console.log(msg);
    // Сохраняем chatId в базе данных при получении команды /start
    const dbWriter = new MyDbWriter(); // Используем MyDbWriter
    dbWriter.on('queryExecuted', (executionTime) => {
      console.log(`Время выполнения: ${executionTime} мс`);
    });
    await dbWriter.saveFieldToDatabase(msg.chat.id, 'chatId'); // Убираем 'usersInfo', так как это уже учитывается в MyDbWriter

    const isAdmin = await dbWriter.checkAdminStatus(msg.chat.id);
    console.log(isAdmin);
    if (isAdmin) {
      // Делаем что-то для администратора
      bot.sendMessage(msg.chat.id, 'Вы - администратор. Добро пожаловать в админ-панель.');
    } else {
      // Делаем что-то для обычного пользователя
      bot.sendMessage(msg.chat.id, 'Вы - обычный пользователь.');
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

export class HelpCommandHandler implements CommandHandler {
  handle(bot: MyTelegramBot, msg: Message) {
    const response = 'Доступные команды:\n' +
      '/start - Запустить бота\n' +
      '/record - Записать голосовое сообщение\n' +
      '/hello - Получить приветственное сообщение\n' +
      '/help - Получить список доступных команд';
    bot.sendMessage(msg.chat.id, response);
    console.log('Получена команда /help.');
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
