import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BodyshapePageRoutingModule } from './bodyshape-routing.module';

import { BodyshapePage } from './bodyshape.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BodyshapePageRoutingModule
  ],
  declarations: [BodyshapePage]
})
export class BodyshapePageModule {}
