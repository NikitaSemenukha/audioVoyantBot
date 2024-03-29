import { Filter } from "mongodb";
import { UserInfo } from "./UserInfo/UserInfo.interface";
import { DbWriter } from "./db.writer.abstract";
import { config } from 'dotenv';

config();

const adminChatId: number = Number(process.env.ADMIN_ID);

export class MyDbWriter extends DbWriter<Document> {

  protected getCollectionName(): string {
    return 'usersInfo';
  }

  async checkAdminStatus(chatId: number): Promise<boolean> {
      return chatId === adminChatId;
  }
}