import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  index: number;

  constructor(
    public navParams: NavParams,
    private viewController: ViewController
  ) {}

  ionViewWillLoad() {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  onLeave() {
    this.viewController.dismiss();
  }

  onDelete() {
    this.viewController.dismiss({index: this.index});
  }

}
