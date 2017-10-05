import { Authorization } from './../../model/auth/authorization';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {JwtHelper} from "angular2-jwt";
import * as moment from 'moment';



@Injectable()
export class BungieAuth {

  private client_secret: string = 'X7HR205k0rFDYzr7F5lTuObL5DOqd1OHppN4.s9oLNY';
  private client_id: string = '21542';
  private redirect_uri: string = 'https://localhost/callback';
  private api_key: string = 'f026c6c68ee3469eab6dd01290250222';
  private scopes: string = 'ReadBasicUserProfile MoveEquipDestinyItems ReadDestinyInventoryAndVault ReadUserData ReadDestinyVendorsAndAdvisors';
  private AUTHORIZATIONKEY = 'authorization';
  //private TOKENKEY = 'token'; // name of the key in storage
  private loader; // reference to the loader
  private authorization: Authorization;

  private BUNGIEAUTHURL = 'https://www.bungie.net/en/oauth/authorize';
  private BUNGIETOKENURL = 'https://www.bungie.net/platform/app/oauth/token/';


  constructor(private http: Http, private storage: Storage, private loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser) {
    // fetch the authorization on load
    this.storage.get(this.AUTHORIZATIONKEY).then((auth) => {
      const authorized = Authorization.getNewInstance();
      if (auth) {
        authorized.setAccessToken(auth.accessToken);
        authorized.setAccessTokenExpiry(auth.accessTokenExpiry);
        authorized.setRefreshToken(auth.refreshToken);
        authorized.setRefreshTokenExpiry(auth.refreshTokenExpiry);
        this.authorization =authorized;
      } else {
        this.authorization =authorized;
      }
    });
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + this.authorization.getAccessToken);
    headers.append('Accept-Language', 'en_US');
    headers.append('Content-Type', 'application/json');
  }

  isAuthenticated(): Observable<boolean> {
    this.showLoader('Autenticating...');
    return new Observable<boolean>((observer) => {
      this.storage.ready().then(() => {
        this.storage.get(this.AUTHORIZATIONKEY).then((auth) => {
          if (auth.accessTokenExpiry) {
            if (moment(new Date(auth.accessTokenExpiry)).isAfter(moment())) {
              console.log('Token expiry : ' + auth.accessTokenExpiry + ' is after ' + new Date());
              alert('IS AUTHENTICATED WITH VALID TOKEN');
              observer.next(true);
            } else {
              alert('GET REFRESH TOKEN');
              observer.next(false);
            }
            observer.complete();
            this.hideLoader();
          } else {
            observer.next(false);
            observer.complete();
            this.hideLoader();
          }
        });
      });
    });
  }

  logout(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
    this.storage.ready().then(() => {
      this.storage.set(this.AUTHORIZATIONKEY, undefined);
      this.authorization = undefined;
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
          if (url.indexOf(this.redirect_uri) === 0) {
            browser.close();
            let resp = (url).split("?")[1];
            let responseParameters = resp.split("&");
            var parameterMap: any = {};
            for (var i = 0; i < responseParameters.length; i++) {
              parameterMap[responseParameters[i].split("=")[0]] =
              responseParameters[i].split("=")[1];
            }
            let headers = new Headers({'Content-Type': "application/x-www-form-urlencoded", 'Origin': "mikeymisfit", 'x-api-key': "f026c6c68ee3469eab6dd01290250222"});
            let options = new RequestOptions({ headers: headers });
            let data =`client_secret=${this.client_secret}&client_id=${this.client_id}&grant_type=authorization_code&redirect_uri=${this.redirect_uri}&code=${parameterMap.code}`;
            return this.http.post('https://www.bungie.net/platform/app/oauth/token/', data, options)
              .subscribe((data) => {
                let respJson: any = data.json();
                console.log('respJson', respJson);
                this.saveAuthorization(respJson);
                observer.next(true);
                observer.complete();
              }
            );
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

  private saveAuthorization(jsonObject){
    if(jsonObject) {
      const auth = Authorization.getNewInstance();
      let currentDate:Date = new Date();
      let accessTokenCurrentDate:Date = currentDate;
      let refreshTokenCurrnetDate:Date = currentDate;
      auth.setAccessToken(jsonObject.access_token);
      auth.setAccessTokenExpiry(new Date(accessTokenCurrentDate.setSeconds(jsonObject.expires_in)));
      auth.setRefreshToken(jsonObject.refresh_token);
      auth.setRefreshTokenExpiry(new Date(refreshTokenCurrnetDate.setSeconds(jsonObject.refresh_expires_in)));
      auth.setMemberId(jsonObject.membershipId);

      this.storage.ready().then(() => {
        this.storage.set(this.AUTHORIZATIONKEY, undefined);
        this.storage.set(this.AUTHORIZATIONKEY, auth);
      });
    } else {
      this.storage.ready().then(() => {
        this.storage.set(this.AUTHORIZATIONKEY, undefined);
      });
    }
  }

  public getAuthorization(): Authorization {
    return this.authorization;
  }

}
