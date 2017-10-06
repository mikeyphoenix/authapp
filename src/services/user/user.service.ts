import { Storage } from '@ionic/storage';
import { User } from './../../model/user/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private currentUser: User;
  private CURRENTUSERKEY: string = 'currentuser';

  constructor(private storage: Storage) {

  }


  public saveUser(user: User) {
    if (user) {
      this.storage.ready().then(() => {
        this.storage.set(this.CURRENTUSERKEY, undefined);
        this.storage.set(this.CURRENTUSERKEY, user);
        this.currentUser = user;
      });
    } else {
      this.storage.ready().then(() => {
        this.storage.set(this.CURRENTUSERKEY, undefined);
        this.currentUser = undefined;
      });
    }
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

}
