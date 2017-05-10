import { Component, OnInit } from '@angular/core';
import { App } from './../../services/app';

// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
    templateUrl: 'home.html'
})

export class HomePage implements OnInit {



    constructor(
        // db: AngularFireDatabase,
        public app: App
    ) {



    }

    ngOnInit() { }
}
