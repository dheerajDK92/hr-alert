import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { companyPage } from './company.page';

const routes: Routes = [
  {
    path: '',
    component: companyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class companyPageRoutingModule {}
