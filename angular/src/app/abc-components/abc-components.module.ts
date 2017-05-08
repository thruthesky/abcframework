import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { AbcHeader } from './abc-header/abc-header';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        AbcHeader
    ],
    declarations: [
        AbcHeader
    ],
    providers: [],
})
export class AbcComponents { }
