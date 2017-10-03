import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BungieApi } from './../../services/bungie.service';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private api: BungieApi, public navCtrl: NavController, public navParams: NavParams) {
    // check if the user is already authenticated
    this.api.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        alert('Authenticated: ');
        this.navCtrl.setRoot(HomePage);
      }else {
        alert('NOT Authenticated: ');
      }
    // else relax!
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  auth() {
    this.api.auth().subscribe((isAuthSuccess) => {
      this.navCtrl.setRoot(HomePage);
    }, function(e) {
      // handle this in a user friendly way.
      console.log('Fail!!', e);
    });
  }

}
