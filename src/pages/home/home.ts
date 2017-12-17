import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlaceService } from '../../services/place';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPlacePage = AddPlacePage;

  places: Place[];

  initPageLoading = true;

  constructor(
    public navCtrl: NavController,
    private placeService: PlaceService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.getPlaces();
  }

  onOpenPlace(place: Place, index: number) {
    const modal = this.modalController.create(PlacePage, {place, index});
    modal.present();
    modal.onDidDismiss((data) => {
      if (data && typeof data.index === 'number') {
        this.deletePlace(data.index);
        this.places.splice(data.index, 1);
      }
    })
  }

  deletePlace(index: number) {
    this.placeService.deletePlace(index);
  }

  private getPlaces() {
    let loader;
    if (this.initPageLoading) {
      loader = this.loadingController.create({
        content: 'Loading...'
      });
      loader.present();
    }
    this.placeService.getPlaces()
      .then((places: Place[]) => {
        this.places = places;
        if (this.initPageLoading) {
          loader.dismiss();
          this.initPageLoading = false;
        }
      })
      .catch(() => {
        if (this.initPageLoading) {
          loader.dismiss();
          this.initPageLoading = false;
        }
        let alert = this.alertController.create({
          title: 'Can\'t Get Places',
          buttons: ['OK']
        });
        alert.present();
      });
  }
}
