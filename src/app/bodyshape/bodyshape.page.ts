import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';



@Component({
  selector: 'app-bodyshape',
  templateUrl: './bodyshape.page.html',
  styleUrls: ['./bodyshape.page.scss'],
})
export class BodyshapePage implements OnInit {

  _predictions = [];

  constructor() { }

  ngOnInit() {
  }

  async takePicture() {
    const imageData = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    const predictions = await this.classifyImage(imageData);
    // Do something with predictions
  }



  classifyImage = async (imageData: CameraImageData) => {
    if (imageData.webPath) {
      const img = new Image();
      img.src = imageData.webPath;
      await img.decode();

      const imageTensor = tf.browser.fromPixels(img, 3).resizeNearestNeighbor([224, 224]).toFloat();

      const model = await mobilenet.load();
      const predictions = await model.classify(imageTensor as tf.Tensor3D);
      this._predictions = predictions;
      console.log(this._predictions);
      this._predictions.forEach(element => {
        if(element){

        }
      });

      return predictions;
    } else {
      // Handle the case where webPath is undefined
      console.error('webPath is undefined');
      return null;
    }
  }


}


interface CameraImageData {
  webPath?: string;
  // include other properties if needed
}