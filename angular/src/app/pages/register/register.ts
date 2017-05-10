import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from './../../services/app';
import * as firebase from 'firebase/app';

export interface REGISTER_FORM {
    email: string;
    password: string;
    displayName: string;
}
@Component({
    templateUrl: 'register.html'
})

export class RegisterPage implements OnInit {
    form: REGISTER_FORM = {} as REGISTER_FORM;
    error;
    constructor(
        private router: Router,
        private app: App
    ) { }

    ngOnInit() { }

    onSubmit() {
        console.log("onSubmit()");
        firebase.auth()
            .createUserWithEmailAndPassword(this.form.email, this.form.password)
            .then(a => {
                console.log( 'user created: ', a );
                let user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: this.form.displayName,
                    photoURL: null
                })
                .then( () => {
                    console.log( 'user displayName updated: ' );
                    this.app.user.displayName = this.form.displayName;
                    this.router.navigateByUrl('/');
                })
                .catch( e => {
                    this.error = e.message;
                })

                
            })
            .catch( e => {
                this.error = e.message;
            });

    }
}