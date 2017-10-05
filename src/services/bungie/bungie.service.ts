import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {JwtHelper} from "angular2-jwt";



@Injectable()
export class BungieService {
  private client_secret: string = 'X7HR205k0rFDYzr7F5lTuObL5DOqd1OHppN4.s9oLNY';
  private client_id: string = '21542';
  private redirect_uri: string = 'https://localhost/callback';
  private api_key: string = 'f026c6c68ee3469eab6dd01290250222';
  private scopes: string = 'ReadBasicUserProfile MoveEquipDestinyItems ReadDestinyInventoryAndVault ReadUserData ReadDestinyVendorsAndAdvisors';
  // we will be using the sandbox URL for our app
  private UBERSANDBOXAPIURL = 'https://sandbox-api.uber.com/v1.2/';
  // private UBERAPIURL = 'https://api.uber.com/v1.2/';
  private TOKENKEY = 'token'; // name of the key in storage
  private loader; // reference to the loader
  private token; // copy of token in memory

  private BUNGIEAUTHURL = 'https://www.bungie.net/en/oauth/authorize'//?client_id='; + this.client_id + '&response_type=code';
  private BUNGIETOKENURL = 'https://www.bungie.net/platform/app/oauth/token/';

  constructor(private http: Http, private storage: Storage, private loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser) {
    // fetch the token on load
    this.storage.get(this.TOKENKEY).then((token) => {
      this.token = token;
    });
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + this.token);
    headers.append('Accept-Language', 'en_US');
    headers.append('Content-Type', 'application/json');
  }

  isAuthenticated(): Observable<boolean> {
    this.showLoader('Autenticating...');
    return new Observable<boolean>((observer) => {
      this.storage.ready().then(() => {
        this.storage.get(this.TOKENKEY).then((token) => {
          observer.next(!!token); // !! -> converts truthy falsy to boolean.
          observer.complete();
          this.hideLoader();
        });
      });
    });
  }

  logout(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
    this.storage.ready().then(() => {
      this.storage.set(this.TOKENKEY, undefined);
      this.token = undefined;
      observer.next(true);
      observer.complete();
      });
    });
  }

  auth(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.storage.ready().then(() => {
        let browser = this.inAppBrowser.create(`https://www.bungie.net/en/oauth/authorize?client_id=${this.client_id}&response_type=code&redirect_uri=${this.redirect_uri}`, '_blank','location=no,clearsessioncache=yes,clearcache=yes');
        browser.on('loadstart').subscribe((event) => {
          let url = event.url;
          // console.log(url);
          // URLS that get fired
          // 1. https://login.uber.com/oauth/v2/authorize?client_id=9i2dK88Ovw0WvH3wmSH0JA6ZF5Z2GP1&response_type=code&scope=profile%20history%20places%20request
          // 2. https://auth.uber.com/login/?next_url=https%3A%2F%2Flogin.uber.com%2Foauth%...520places%2520request&state=Pa2ONzlEGsB4M41VLKOosWTlj9snJqJREyCFrEhfjx0%3D
          // 3. https://login.uber.com/oauth/v2/authorize?client_id=9i2dK88Ovw0WvH3wmSH0JAry%20places%20request&state=Pa2ONzlEGsB4M41VLKOosWTlj9snJqJREyCFrEhfjx0%3D
          // 4. http://localhost/callback?state=Pa2ONzlEGsB4M41VLKOosWTlj9snJqJREyCFrEhfjx0%3D&code=9Xu6ueaNhUN1uZVvqvKyaXPhMj8Bzb#_
          // we are interested in #4
          if (url.indexOf(this.redirect_uri) === 0) {
            browser.close();
            let resp = (url).split("?")[1];
            alert('Auth Response = ' + resp);
            let responseParameters = resp.split("&");
            var parameterMap: any = {};
            for (var i = 0; i < responseParameters.length; i++) {
              parameterMap[responseParameters[i].split("=")[0]] =
              responseParameters[i].split("=")[1];
            }
            alert(parameterMap);
            console.log('parameterMap', parameterMap);
    /*
    {
    "state":
    "W9Ytf2cicTMPMpMgwh9HfojKv7gQxxhrcOgwffqdrUM%3D",
    "code": "HgSjzZHfF4GaG6x1vzS3D96kGtJFNB#_"
    }
    */
          let headers = new Headers({'Content-Type': "application/x-www-form-urlencoded", 'Origin': "mikeymisfit", 'x-api-key': "f026c6c68ee3469eab6dd01290250222"});
          let options = new RequestOptions({ headers: headers });
          let data =`client_secret=${this.client_secret}&client_id=${this.client_id}&grant_type=authorization_code&redirect_uri=${this.redirect_uri}&code=${parameterMap.code}`;
          return this.http.post('https://www.bungie.net/platform/app/oauth/token/', data, options)
            .subscribe((data) => {
              let respJson: any = data.json();
              alert('Token Response = ' + respJson);
            console.log('respJson', respJson);
    /*
    {
    "last_authenticated": 0,
    "access_token": "snipp",
    "expires_in": 2592000,
    "token_type": "Bearer",
    "scope": "profile history places request",
    "refresh_token": "26pgA43ZvQkxEQi7qYjMASjfq6lg8F"
    }
    */
            this.storage.set(this.TOKENKEY, respJson.access_token);
            this.token = respJson.access_token; // load it up in memory
            observer.next(true);
            observer.complete();
            });
          }
        });
      });
    });
  }

  private showLoader(text?: string) {
    this.loader = this.loadingCtrl.create({
      content: text || 'Loading...'
    });
    this.loader.present();
  }

  public hideLoader() {
    this.loader.dismiss();
    }

}
