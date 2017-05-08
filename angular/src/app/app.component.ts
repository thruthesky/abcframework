import { Component } from '@angular/core';
import { App } from './services/app';
declare var device;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public app: App
  ) {
    document.addEventListener('deviceready', () => this.onDeviceReady(), false);
  }

  onDeviceReady() {
    console.log("Cordova is ready.");
    // console.log(device.cordova);
    this.app.device = device;
  }
}
