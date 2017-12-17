import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Location } from '../../models/location';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  location: Location;
  isLocationSet: boolean;
  marker: Location;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.location = this.navParams.get('location');
    this.isLocationSet = this.navParams.get('isLocationSet') || false;
    if (this.isLocationSet) {
      this.marker = this.navParams.get('location');
    }
  }

  onMapClick(event: any) {
    console.log(new Location(event.coords.lat, event.coords.lng));
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }

  onConfirm() {
    this.viewCtrl.dismiss(this.marker);
  }

  onAbort() {
    this.viewCtrl.dismiss()
  }
}
