import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { menuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: menuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class menuPageRoutingModule {}
