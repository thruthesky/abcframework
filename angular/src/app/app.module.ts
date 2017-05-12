import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

// global custom error handler. need help here.
import { CustomErrorHandler } from './app.error-handler';

// abc componnents. need help here. Make it npm modules or not?
//import { AbcComponents } from './abc-components/abc-components.module';

import { AbcComponents } from 'abc-components';


// app share service.
import { App } from './services/app';


// app root component.
import { AppComponent } from './app.component';


// page components.
import { HomePage } from './pages/home/home';
import { AboutPage } from './pages/about/about';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { ProfilePage } from './pages/profile/profile';


// angulare fire 2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';


const appRoutes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'profile', component: ProfilePage },
  { path: 'about', component: AboutPage },
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', component: HomePage }
]

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    AboutPage,
    LoginPage,
    RegisterPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AbcComponents
  ],
  providers: [
    App,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
