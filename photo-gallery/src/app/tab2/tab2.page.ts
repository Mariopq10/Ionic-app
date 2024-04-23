import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../interfaces/user-photo.interface';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private photoService: PhotoService) {}

  get photos(): UserPhoto[] {
    return this.photoService.photos;
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  deletePhoto(position: number) {
    this.photoService.deletePhoto(position);
  }

}
