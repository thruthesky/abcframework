import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { CustomErrorHandler } from './app.error-handler';
import { AbcComponents } from './abc-components/abc-components.module';

import { App } from './services/app';


import { AppComponent } from './app.component';

import { HomePage } from './pages/home/home';
import { AboutPage } from './pages/about/about';

const appRoutes: Routes = [
  { path: 'about', component: AboutPage },
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', component: HomePage }
]

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    AbcComponents
  ],
  providers: [
    App,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
