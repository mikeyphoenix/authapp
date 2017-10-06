import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { User } from './../../model/user/user';
import { BungieApi } from './bungie.api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';


@Injectable()
export class BungieUser {

  constructor(private http: Http, private bungieApi: BungieApi, private userService: UserService) {

  }

  getUserByMemberId(memberId: string): Observable<User> {
    return new Observable<User>(observer => {
      this.bungieApi.showLoader("Getting User Info");
      const apiPath = '/User/GetBungieNetUserById/{memberId}';

      let headers = new Headers({'Authorization': "Bearer " + this.bungieApi.getAccessToken(), 'Origin': this.bungieApi.getApiOrigin(), 'x-api-key': this.bungieApi.getApiKey()});
      let options = new RequestOptions({ headers: headers });

      console.log('getUserByMemberId URL = ' + this.bungieApi.getApiRoot()+apiPath.replace('{memberId}', memberId));
      console.log('Access Token: ' + this.bungieApi.getAccessToken());

      return this.http.get(this.bungieApi.getApiRoot() + apiPath.replace('{memberId}', memberId), options)
        .subscribe((data) => {
          let respJson: any = data.json();
          console.log('respJson', respJson);
          const user: User = User.parseUserFromJSONObject(respJson);
          this.userService.saveUser(user);
          observer.next(user);
          observer.complete();
          this.bungieApi.hideLoader();
        }, (err) => {
          console.log(err);
          observer.next(undefined);
          observer.complete();
          this.bungieApi.hideLoader();
        });
    });
  }

}
