import { EventEmitter } from 'events';
import { Filter, Document } from 'mongodb';
import { Database } from './db';

export abstract class DbWriter<T extends Document> extends EventEmitter {
    protected abstract getCollectionName(): string;

    async saveFieldToDatabase( value: any, 
        fieldName: string, 
        filterFunction: (value: any) => Filter<T>, // Добавляем параметр filterFunction
        shouldSave: boolean) {
        if (!shouldSave) {
            console.log(`Запись не будет сохранена в базе данных.`);
            return;
        }

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

            if (shouldSave) {
                const filter: Filter<T> = filterFunction(value);
                
                const existingDocument = await collection.findOne(filter);
                console.log(existingDocument);
                if (!existingDocument) {
                    const document: any = {};
                    document[fieldName] = value;

                    await collection.insertOne(document);

                    console.log(`${fieldName} ${value} успешно сохранен в базе данных.`);
                } else {
                    console.log(`${fieldName} ${value} уже существует в базе данных.`);
                }
            } else {
                console.log(`Запись не будет сохранена в базе данных.`);
            }
        } catch (error) {
            console.error(`Ошибка при сохранении ${fieldName}:`, error);
        } finally {
            db.close();
        }
    }
    
}
