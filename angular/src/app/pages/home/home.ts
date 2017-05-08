import { Component, OnInit } from '@angular/core';
import { App } from './../../services/app';

@Component({
    templateUrl: 'home.html'
})

export class HomePage implements OnInit {

    constructor(
        public app: App
    ) {
        
    }

    ngOnInit() { }
}
