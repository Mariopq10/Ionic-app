import { Injectable } from '@angular/core';

import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences';
import { UserPhoto } from '../interfaces/user-photo.interface';
@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos'

constructor() {
  this.loadSaved();
 }

private async readAsBase64(photo:Photo){
  const response = await fetch(photo.webPath!)
  const blob = await response.blob()

  return await this.convertBlobToBase64(blob) as string;
}

private async savePicture ( photo:Photo ): Promise<UserPhoto>{
const base64Data = await this.readAsBase64(photo);

const fileName = Date.now()+'.jpeg';
const savedFile = await Filesystem.writeFile({
  path:fileName,
  data: base64Data,
  directory: Directory.Data
})

return{
  filepath:fileName,
  webViewPath: photo.webPath
}
}

private convertBlobToBase64 = (blob: Blob) => new Promise ((resolve,reject)=>{
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () =>{
    resolve(reader.result);
  };
  reader.readAsDataURL(blob)
})





public async addNewToGallery() {

  const capturedPhoto = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 100,
  });

  const savedImageFile : UserPhoto = await this.savePicture(capturedPhoto);
  this.photos.unshift(savedImageFile)
  Preferences.set({
    key: this.PHOTO_STORAGE,
    value: JSON.stringify(this.photos)
  })
  }

  deletePhoto(position: number) {
    // Verifica si la posición proporcionada es válida
    if (position >= 0 && position < this.photos.length) {
      // Elimina la foto del array en la posición dada
      this.photos.splice(position, 1);
      this.savePhotosToStorage();
    }
  }

  public async loadSaved(){
    const { value } = await Preferences.get({key: this.PHOTO_STORAGE })
    this.photos = (value ? JSON.parse(value): [] ) as UserPhoto[];

    for (let photo of this.photos){
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      })
      photo.webViewPath = `data:image/jpeg;base64,${readFile.data}`
    }
  }

  private async savePhotosToStorage() {
    // Guarda el array de fotos en el almacenamiento local
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

  }

}

