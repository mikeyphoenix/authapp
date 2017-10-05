import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Authorization } from './../../model/auth/authorization';

@Injectable()
export class BungieApi {

  private apiRoot: string = 'https://bungie.net/Platform';
  private apiKey: string = 'f026c6c68ee3469eab6dd01290250222';
  private origin: string = 'file://';

  constructor(private http: Http, private auth: Authorization) {

  }

  public getApiHeader(): Headers {
    let headers = new Headers();
    if (this.auth) {
      headers.append('Authorization', 'Bearer ' + this.auth.getAccessToken);
      headers.append('x-api-key', this.apiKey);
      headers.append('Origin', this.origin);
    }

    return headers;
  }

  public getApiRoot(): string {
    return this.apiRoot;
  }
}
