import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { CustomErrorHandler } from './app.error-handler';
import { AbcComponents } from './abc-components/abc-components.module';

import { AppComponent } from './app.component';

import { HomePage } from './pages/home/home';
import { FileNotFoundPage } from './pages/file-not-found/file-not-found';

const appRoutes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', component: FileNotFoundPage }
]

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    FileNotFoundPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    AbcComponents
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
