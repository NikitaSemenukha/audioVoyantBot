import { Collection, Db } from "mongodb";
import { UserInfo } from "./UserInfo.interface";

export class UsersInfoCollection {
    private collection: Collection<UserInfo>;
  
    constructor(db: Db) {
      this.collection = db.collection<UserInfo>('usersInfo');
    }
  
    async updateOrInsertUserInfo(userInfo: UserInfo) {
      const filter = { id: userInfo.id };
      const update = {
        $set: {
          is_Admin: userInfo.is_Admin,
          is_bot: userInfo.is_bot,
          first_name: userInfo.first_name,
          username: userInfo.username,
          language_code: userInfo.language_code,
          regDate: userInfo.regDate,
          lastRestart: userInfo.lastRestart
        }
      };
      const options = { upsert: true };
  
      await this.collection.updateOne(filter, update, options);
    }
  }