import { EventEmitter } from 'events';
import { Filter } from "mongodb";
import { Database } from "./db";

export abstract class DbWriter<T extends Document> extends EventEmitter {
  protected abstract getCollectionName(): string;

  async saveFieldToDatabase(value: any, fieldName: string) {
    const dbName = process.env.DB_USERS;
    const url = process.env.DB_USERS_URL_CONNECT;
    
    if (!url) {
      throw new Error('MongoDB URL is missing');
    } else if (!dbName) {
      throw new Error('MongoDB dbName is missing');
    }
    const db = new Database(dbName, url);
    await db.connect();

    try {
      const collection = db.getCollection<T>(this.getCollectionName());
      const filter: Filter<T> = { [fieldName]: value } as Filter<T>;
      const existingDocument = await collection.findOne(filter);

      if (!existingDocument) {
        const document: any = {};
        document[fieldName] = value;

        const start = process.hrtime.bigint(); // Время начала выполнения

        await collection.insertOne(document);

        const end = process.hrtime.bigint(); // Время окончания выполнения
        const executionTime = Number(end - start) / 1000000; // Время в миллисекундах

        this.emit('queryExecuted', executionTime);

        console.log(`${fieldName} ${value} успешно сохранен в базе данных.`);
      } else {
        console.log(`${fieldName} ${value} уже существует в базе данных.`);
      }
    } catch (error) {
      console.error(`Ошибка при сохранении ${fieldName}:`, error);
    } finally {
      db.close();
    }
  }
}
