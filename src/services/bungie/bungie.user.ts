import { User } from './../../model/user/user';
import { BungieApi } from './bungie.api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()
export class BungieUser {

  constructor(private http: Http, private bungieApi: BungieApi) {

  }

  /* getUserByMemberId(memberId: string): User {
    const apiPath = '/User/GetBungieNetUserById/{memberId}';
    let options = new RequestOptions({ headers: this.bungieApi.getApiHeader() });
    const user : User = new User();

    this.http.get(this.bungieApi.getApiRoot()+apiPath.replace('memberId', memberId), options)
      .subscribe((data) => {
        let respJson: any = data.json();
        console.log('respJson', respJson);
        if (data) {

        }
      }
    );

    return user;
  } */
}
