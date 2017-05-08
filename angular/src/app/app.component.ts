import { Component } from '@angular/core';
declare var device;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  device;
  constructor() {
    document.addEventListener('deviceready', () => this.onDeviceReady(), false);
  }

  onDeviceReady() {
    console.log("Cordova is ready.");
    // console.log(device.cordova);
    this.device = device;
  }
}
