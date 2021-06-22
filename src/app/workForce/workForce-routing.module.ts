import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { workForcePage } from './workForce.page';

const routes: Routes = [
  {
    path: '',
    component: workForcePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class workForcePagePageRoutingModule {}
