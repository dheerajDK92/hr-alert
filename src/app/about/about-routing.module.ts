import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { aboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: aboutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class aboutPageRoutingModule {}
