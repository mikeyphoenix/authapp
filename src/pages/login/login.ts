import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BungieAuth } from './../../services/bungie/bungie.auth';
import { HomePage } from '../home/home';
import { BungieUser } from '../../services/bungie/bungie.user';

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

  constructor(private bungieAuth: BungieAuth, private bungieUser: BungieUser, public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    // check if the user is already authenticated
    this.bungieAuth.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        // alert('Authenticated: ' + this.bungieAuth.getAuthorization());
        if(this.bungieAuth.getAuthorization()) {
          console.log('Authenticated: ' + this.bungieAuth.getAuthorization().getAccessToken());
          alert('Welcome : ' + this.bungieUser.getUserByMemberId(this.bungieAuth.getAuthorization().getMemberId()));
        }
        this.navCtrl.setRoot(HomePage);
      }else {
        //alert('NOT Authenticated: ');
      }
    // else relax!
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  auth() {
    this.bungieAuth.auth().subscribe((isAuthSuccess) => {
      //Create a local instance of the user
      this.storage.ready().then(() => {
        this.bungieUser.getUserByMemberId(this.bungieAuth.getAuthorization().getMemberId()).subscribe((user) => {
          if(user) {
            alert('Welcome : ' + user.getDisplayName());
            this.navCtrl.setRoot(HomePage);
          }
        });
      });

    }, function(e) {
      // handle this in a user friendly way.
      console.log('Fail!!', e);
    });
  }

}
