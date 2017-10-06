import { BungieAuth } from './bungie.auth';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Authorization } from './../../model/auth/authorization';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class BungieApi {

  private apiRoot: string = 'https://bungie.net/Platform';
  private apiKey: string = 'f026c6c68ee3469eab6dd01290250222';
  private origin: string = 'file://';
  private loader;

  constructor(private http: Http, private bungieAuth: BungieAuth, private loadingCtrl: LoadingController) {

  }

  public getApiHeader(): Headers {
    let headers = new Headers();
    const auth: Authorization = this.bungieAuth.getAuthorization();
    if (auth) {
      headers.append('Authorization', 'Bearer ' + auth.getAccessToken());
      headers.append('x-api-key', this.apiKey);
      headers.append('Origin', this.origin);
    }

    return headers;
  }

  public getApiRoot(): string {
    return this.apiRoot;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getApiOrigin(): string {
    return this.origin;
  }

  public getAccessToken(): string {
    return this.bungieAuth.getAuthorization().getAccessToken();
  }

  public showLoader(text?: string) {
    this.loader = this.loadingCtrl.create({
      content: text || 'Loading...'
    });
    this.loader.present();
  }

  public hideLoader() {
    this.loader.dismiss();
  }
}
