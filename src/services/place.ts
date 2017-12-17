import { Place } from '../models/place';
import { Location } from '../models/location';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

declare var cordova: any;

@Injectable()
export class PlaceService {
  private places: Place[] = [];

  constructor(
    private storage: Storage,
    private file: File
  ) {}

  addPlace(
    title: string,
    description: string,
    location: Location,
    imagePath: string) {
    const place = new Place(title, description, location, imagePath);
    this.places.push(place);
    this.storage.set('places', this.places.slice())
      .catch((err) => {
        this.places.splice(this.places.indexOf(place), 1);
      });
  }

  getPlaces() {
    return new Promise((resolve, reject) => {
      if (this.places.length === 0) {
        this.getPlacesFormStorage()
          .catch((err) => {
            reject(err);
          })
          .then((places: Place[]) => {
            if (places && places.length > 0) {
              this.places = places;
              resolve(this.places.slice());
            } else {
              resolve(this.places);
            }
          });
      } else {
        resolve(this.places.slice());
      }
    });
  }

  private getPlacesFormStorage() {
    return this.storage.get('places')
      .then((places: Place[]) => {
        return places;
      });
  }

  private removeFile(place: Place) {
    const currentName = place.imagePath.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirectory, currentName)
      .then(() => console.log('File was removed'));
  }

  deletePlace(index: number) {
    const place: Place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('places', this.places.slice())
      .then(() => {
        this.removeFile(place);
      })
      .catch((err) => {
        this.places.splice(index, 0, place);
      });
  }
}
