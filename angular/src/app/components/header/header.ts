import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from './../../services/app';

@Component({
    selector: 'header-component',
    templateUrl: 'header.html',
    styleUrls: ['header.scss']
})

export class HeaderComponent implements OnInit {

    showMenu: boolean = false;

    constructor(
        public app: App,
        public router: Router
    ) { }

    ngOnInit() { }


    onClickLogout() {
        this.app.logout(() => {
            console.log("user logged out.");
            this.router.navigateByUrl('/');
        });
    }
}