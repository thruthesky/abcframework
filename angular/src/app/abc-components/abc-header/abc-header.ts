import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'abc-header',
    templateUrl: 'abc-header.html',
    styleUrls: [ 'abc-header.scss' ]
})

export class AbcHeader implements OnInit {

    logged: boolean = true;
    showMenu: boolean = false;

    constructor() { }

    ngOnInit() { }
}