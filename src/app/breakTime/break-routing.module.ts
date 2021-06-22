import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { breakPage } from './break.page';

const routes: Routes = [
  {
    path: '',
    component: breakPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class breakPageRoutingModule {}
