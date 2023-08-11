import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bodyshape',
  templateUrl: './bodyshape.page.html',
  styleUrls: ['./bodyshape.page.scss'],
})
export class BodyshapePage implements OnInit {
 
  detectedBodyshape;
  infoText;

  _predictions = [];

  constructor(private router:Router, private loadingController:LoadingController) { }

  ngOnInit() {
  }

  goToWorkout(){
    this.router.navigate(['/workout']);

  }

  changeText(subject){

    if(this.detectedBodyshape == 'Ectomorph'){

    switch (subject) {
      case 'description':
        this.infoText = 'Ectomorphs are the body type that is the most resistant to weight and muscle gain because of a fast metabolism. In other words, ectomorphs are often able to overeat while gaining little or even no weight. People with this body type have little observable body fat, are only lightly muscled, and have a small frame (and joints). Ectomorphs tend to have long thin limbs with stringy muscles. Shoulders tend to be thin with little width.'; 
        break;
      case 'workout':
        this.infoText = 'Training Days: 3-4 times a week. Ensure adequate rest between sessions.'+
        'Training Split: A full-body routine or an upper/lower split can be effective.'+
        'Sets & Reps: 3-4 sets of 6-10 reps for most exercises.'+
        'Rest Between Sets: 60-90 seconds.'+
        'Key Exercises: Compound movements like squats, deadlifts, bench presses, pull-ups, and rows.'
        'Progressive Overload: Gradually increase weights as you become stronger.';
      break;
      case 'nutrition':
        this.infoText = 'Caloric Surplus: Aim for 250-500 calories above your maintenance level. This ensures you are eating enough to build muscle.' + 
        'Macronutrient Distribution: Opt for a higher carb intake. A typical macronutrient split can be 50% carbs, 25% protein, and 25% fat. '+
        'Frequent Meals: Eat every 2-3 hours. Incorporate snacks to ensure you are meeting your caloric goals. '+
        'Post-Workout Nutrition: Consume a shake or meal that combines protein and carbs, shortly after your workout.';   
      break;   
      }
    }
  }

  async takePicture() {
    
     const loading = await this.loadingController.create({
       message: 'Detecting body shape...'
     });
     loading.present();

    // await loading.present();
    const imageData = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    
    const predictions = await this.classifyImage(imageData);
    // Do something with predictions
    await loading.dismiss();
  }



  classifyImage = async (imageData: CameraImageData) => {
    if (imageData.webPath) {
      const img = new Image();
      img.src = imageData.webPath;
      await img.decode();

      const imageTensor = tf.browser.fromPixels(img, 3).resizeNearestNeighbor([224, 224]).toFloat();

      //load a custom model here
      //q: is there a website where i can download tensorflow.js models?


      const model = await mobilenet.load();
      const predictions = await model.classify(imageTensor as tf.Tensor3D);
      this._predictions = predictions;
      console.log(this._predictions);
      this._predictions.forEach(element => {

          switch (element.className.toLowerCase()) {
            case 'atm':
            case 't shirt':
            case 'maillot':
            case 'miniskirt':
            case 'umbrella':
            case 'pijama':
            case 'water bottle':
                console.log('Ectomorph');
                this.detectedBodyshape = 'Ectomorph';
                this.infoText = 'Ectomorphs are the body type that is the most resistant to weight and muscle gain because of a fast metabolism. In other words, ectomorphs are often able to overeat while gaining little or even no weight. People with this body type have little observable body fat, are only lightly muscled, and have a small frame (and joints). Ectomorphs tend to have long thin limbs with stringy muscles. Shoulders tend to be thin with little width.';
                //alert('Ectomorph');
                break;
            case 'drum':
            case 'ping-pong ball':
            case 'shower cap':
            case 'sweatshirt':
            case 'knee pad':    
                console.log('Mesomorph');
                this.detectedBodyshape = 'Mesomorph';
                //alert('Mesomorph');
                break;
            case 'sandal':
            case 'cardigan':
            case 'jenim':
            case 'overskirt':
            case 'poncho':
            case 'bucket':
            case 'mailbox':  
                console.log('Endomorph');
                this.detectedBodyshape = 'Endomorph';
                //alert('Endomorph');
                break;
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