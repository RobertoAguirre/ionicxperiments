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
    }else if(this.detectedBodyshape == 'Mesomorph'){
      switch (subject) {
        case 'description':
          this.infoText = 'Mesomorphs are typically characterized by a naturally muscular and athletic physique.'+
          'They have a medium bone structure, naturally lean body, and an easier time gaining muscle and strength.'+
          'The primary goal for most mesomorphs is often to develop a well-defined, symmetrical physique, emphasizing both muscle size and leanness';
          break;
        case 'workout':
          this.infoText = 'Training Days: 4-5 days a week.'+
          'Training Split: A push/pull/legs (PPL) split or a body-part split can be effective.'+
          'Sets & Reps:'+
          'For Strength: 3-5 sets of 4-6 reps.'+
          'For Hypertrophy: 3-4 sets of 8-12 reps.'+
          'Rest Between Sets: 60-90 seconds for hypertrophy, 2-3 minutes for strength.'+
          'Key Exercises: Compound movements like squats, deadlifts, bench presses, overhead presses, and pull-ups.'+
          'Variation: Incorporate isolation exercises to target specific muscles.'+
          'Progressive Overload: Ensure weights are increased gradually as strength builds.';
        break;
        case 'nutrition':
          this.infoText = 'Caloric Maintenance or Slight Surplus: Mesomorphs dont need a heavy surplus. A slight surplus of 250-300 calories is enough for muscle growth' + 
          'Macronutrient Distribution: A balanced approach works well. A potential split could be 40% carbs, 30% protein, and 30% fat. '+
          'Meal Timing: 4-6 meals a day. Prioritize protein in every meal and carbs around workouts. '+
          'Hydration: At least 3 liters of water a day, more if training intensely.';   
        break;   
        }
    }else{
      switch (subject) {
        case 'description':
          this.infoText = 'Endomorphs are typically characterized by a rounder or softer physique, with a natural tendency to store more body fat. They often have a wider waist and hips compared to ectomorphs and mesomorphs. The main goals for many endomorphs usually revolve around fat loss, lean muscle building, and boosting metabolism.';
          break;
        case 'workout':
          this.infoText = 'Training Days: 3-4 times a week.'+
          'Training Split: A full-body routine or an upper/lower split can be effective.'+
          'Sets & Reps:'+
          'For Strength: 3-4 sets of 5-7 reps.'+
          'For Hypertrophy: 2-3 sets of 10-15 reps.'+
          'Rest Between Sets: 45-60 seconds to keep the heart rate up.'+
          'Key Exercises: Compound movements like squats, deadlifts, bench presses, and rows to engage multiple muscles and burn more calories.'+
          'Progressive Overload: Gradually increase weights to continue muscle growth and strength.';
        break;
        case 'nutrition':
          this.infoText = 'Caloric Maintenance or Slight Deficit: Aim for a deficit of about 250-500 calories to promote fat loss.'+
          'Macronutrient Distribution: Higher protein and moderate fat with a controlled carb intake works well. Consider a split like 35% protein, 35% fat, and 30% carbs.'+
          'Meal Timing: 4-5 smaller, balanced meals a day. This helps in keeping metabolism active and regulating insulin.'+
          'Limit Sugar & Processed Foods: Focus on whole foods with a good fiber content to improve satiety.';
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
            case 'hair spray':
            case 'lotion':
            case 'sunscreen':
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
                this.infoText = 'Mesomorphs are typically characterized by a naturally muscular and athletic physique.'+
                'They have a medium bone structure, naturally lean body, and an easier time gaining muscle and strength.'+
                'The primary goal for most mesomorphs is often to develop a well-defined, symmetrical physique, emphasizing both muscle size and leanness';
                //alert('Mesomorph');
                break;
            case 'sandal':
            case 'cardigan':
            case 'pillow':  
            case 'jenim':
            case 'overskirt':
            case 'poncho':
            case 'bucket':
            case 'mailbox':  
                console.log('Endomorph');
                this.detectedBodyshape = 'Endomorph';
                this.infoText = 'Endomorphs are typically characterized by a rounder or softer physique, with a natural tendency to store more body fat. They often have a wider waist and hips compared to ectomorphs and mesomorphs. The main goals for many endomorphs usually revolve around fat loss, lean muscle building, and boosting metabolism.';

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