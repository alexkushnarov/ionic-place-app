import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { PlaceService } from '../../services/place';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { File } from '@ionic-native/file';

declare var cordova: any;

const initialLocation: Location = {
  lat: 51.678418,
  lng: 7.809007
};

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = initialLocation;
  isLocationSet = false;
  pictureSrc: string;

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private camera: Camera,
    private file: File,
    private placeService: PlaceService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onLocate() {
    const loading = this.loadingController.create({
      content: 'Please wait...'
    });
    loading.present();
    this.geolocation.getCurrentPosition()
      .catch(() => {
        loading.dismiss();
        let alert = this.alertController.create({
          title: 'Can\'t Locate you ',
          subTitle: 'Go to the Settings and allow to get your Location',
          buttons: ['OK']
        });
        alert.present();
      })
      .then((resp: any) => {
        this.location = new Location(resp.coords.latitude, resp.coords.longitude);
        this.isLocationSet = true;
        loading.dismiss();
      });
  }

  onOpenMap() {
    const modal = this.modalController.create(SetLocationPage, {
      location: this.location,
      isLocationSet: this.isLocationSet
    });
    modal.present();
    modal.onDidDismiss((location: Location) => {
      if (location) {
        this.location = location;
        this.isLocationSet = true;
      }
    });
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options)
      .catch((err) => {
        if (err === 'No Image Selected') {
          return false;
        }
        let alert = this.alertController.create({
          title: 'Can\'t Open Camera',
          subTitle: 'Go to the Settings and allow to use your Camera',
          buttons: ['OK']
        });
        alert.present();
        return false;
      })
      .then((imageData) => {
        if (imageData) {
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          const newFileName = `${new Date().getTime()}.jpg`;
          const path = imageData.replace(/[^\/]*$/, '');
          this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
            .then(data => {
              this.pictureSrc = data.nativeURL.replace(/^file:\/\//, '');
              this.camera.cleanup();
            })
            .catch(err => {
              let alert = this.alertController.create({
                title: 'Can\'t save image',
                subTitle: 'Go to the Settings and allow to use your Library',
                buttons: ['OK']
              });
              alert.present();
              return false;
            });
        }
      });
  }

  onSubmit(form: NgForm) {
    const data = form.value;
    this.placeService.addPlace(data.title, data.description, this.location, this.pictureSrc);
    form.reset();
    this.pictureSrc = null;
    this.isLocationSet = false;
    this.location = initialLocation;
    this.navCtrl.pop();
  }

}
