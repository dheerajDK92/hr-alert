import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { advancePage } from './advance.page';

const routes: Routes = [
  {
    path: '',
    component: advancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class advancePageRoutingModule {}
