// commandHandlers.ts
import { Message } from 'node-telegram-bot-api';
import MyTelegramBot from '../../bot';
import { Database } from '../../db/db';
import { DbWriter } from '../../db/db.writer.abstract';
import { MyDbWriter } from '../../db/db.writer';
import { UsersInfoCollection } from '../../db/UserInfo/UserInfo.collection';
import { UserInfo } from '../../db/UserInfo/UserInfo.interface';


export interface CommandHandler {
  handle(bot: MyTelegramBot, msg: Message): void;
}

export class StartCommandHandler implements CommandHandler {
  async handle(bot: MyTelegramBot, msg: Message) {
      const response = 'Привет! Я - простейший Telegram бот. Введите /hello, чтобы получить приветственное сообщение.';
      bot.sendMessage(msg.chat.id, response);
      bot.sendStartMenu(msg.chat.id);
      // Создаем экземпляр UsersInfoCollection, передавая экземпляр базы данных
      const dbWriter = new MyDbWriter();
    
      const userInfo: UserInfo = {
          id: msg.chat.id,
          is_Admin: await dbWriter.checkAdminStatus(msg.chat.id), // Предположим, что у вас есть метод checkAdminStatus в вашей базе данных
          is_bot: msg.from?.is_bot || false,
          first_name: msg.from?.first_name || "",
          username: msg.from?.username || "",
          language_code: msg.from?.language_code || "",
          regDate: msg?.date,
          lastRestart: Math.floor(new Date().getTime() / 1000)
      };
      console.log();
      await dbWriter.saveFieldToDatabase(
        userInfo, 
        'data', 
        (value) => ({ 'data.id': value['id'] }), 
        true
    );
      const isAdmin = userInfo.is_Admin;
    
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
