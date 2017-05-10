import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export interface USER {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
};


@Injectable()
export class App {
    device: any;
    user: USER = {} as USER;
    constructor(
        private ngZone: NgZone,
        public afAuth: AngularFireAuth
    ) { }

    get logged() {
        return this.user.displayName !== void 0;
    }

    logout(callback) {
        this.afAuth.auth.signOut()
            .then(callback)
    }

    loginCheck() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user['providerData'].forEach(profile => {
                    this.user.providerId = profile.providerId;
                    this.user.uid = profile.uid;
                    this.user.displayName = profile.displayName;
                    this.user.email = profile.email;
                    this.user.photoURL = profile.photoURL;
                    console.log("user logged in: ", this.user);
                });

            } else {
                console.log("user not logged in");
                this.user = {} as USER;
            }
        });

    }

    zoneRun() {
        this.ngZone.run( () => {} );
    }
}