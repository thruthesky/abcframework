import { Component, OnInit } from '@angular/core';
import { App } from './../../services/app';

@Component({
    selector: 'user-icon',
    templateUrl: 'user-icon.html'
})

export class UserIconComponent implements OnInit {
    constructor(
        public app: App
    ) { }

    ngOnInit() { }
}