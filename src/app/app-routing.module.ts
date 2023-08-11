import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bodyshape',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'barcode',
    loadChildren: () => import('./barcode/barcode.module').then( m => m.BarcodePageModule)
  },
  {
    path: 'bodyshape',
    loadChildren: () => import('./bodyshape/bodyshape.module').then( m => m.BodyshapePageModule)
  },  {
    path: 'workout',
    loadChildren: () => import('./workout/workout.module').then( m => m.WorkoutPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
