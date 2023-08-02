// db.ts
import { MongoClient, Db, Collection } from 'mongodb';

const dbName = 'Users';
const url = 'mongodb://localhost:27017';

export class Database {
  private client: MongoClient;
  private db: Db | null;
  private isConnected: boolean; // Add a flag to track the connection status

  constructor() {
    this.client = new MongoClient(url);
    this.db = null;
    this.isConnected = false; // Initialize the flag to false
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true; // Set the flag to true after connecting
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  get usersInfo(): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection('usersInfo');
  }

  async close() {
    if (this.isConnected) { // Use the isConnected flag to check the connection status
      await this.client.close();
      this.isConnected = false; // Set the flag to false after closing the connection
      console.log('Disconnected from MongoDB');
    }
  }
}
