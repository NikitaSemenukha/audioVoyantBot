import { MongoClient, Db, Document, Collection } from 'mongodb';
require('dotenv').config();

export class Database {
  private client: MongoClient;
  private db: Db | null;
  private isConnected: boolean;
  protected url: string | undefined;
  protected dbName: string | undefined;

  constructor(dbName: string, url: string) {
    
    this.url = url;
    this.dbName = dbName;

    this.client = new MongoClient(this.url);
    this.db = null;
    this.isConnected = false;

  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  getCollection<T extends Document>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(collectionName);
  }

  async close() {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }
}