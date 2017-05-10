import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { App } from './../../services/app';

@Component({
    templateUrl: 'login.html'
})

export class LoginPage implements OnInit {


    error;


    constructor(
        public router: Router,
        public afAuth: AngularFireAuth,
        public app: App
    ) {


    }

    ngOnInit() { }


    onClickLoginWithGoogle() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(() => this.successHandler())
            .catch(e => this.errorHandler(e));
    }

    onClickLoginWithFacebook() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(() => this.successHandler())
            .catch(e => this.errorHandler(e));
    }

    successHandler() {
        this.router.navigateByUrl('/');
    }
    errorHandler(e) {
        console.log('error: ', e);
        this.error = e.message;
        this.app.zoneRun();
    }
}