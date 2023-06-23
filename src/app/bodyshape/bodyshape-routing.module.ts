import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BodyshapePage } from './bodyshape.page';

const routes: Routes = [
  {
    path: '',
    component: BodyshapePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodyshapePageRoutingModule {}
