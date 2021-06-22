import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { punchPage } from './punch.page';

const routes: Routes = [
  {
    path: '',
    component: punchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class punchPageRoutingModule {}
