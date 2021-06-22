import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { teamPage } from './team.page';

const routes: Routes = [
  {
    path: '',
    component: teamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class teamPageRoutingModule {}
