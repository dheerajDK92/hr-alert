import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeReimbursementPage } from './employeeReimbursement.page';

const routes: Routes = [
  {
    path: '',
    component: employeeReimbursementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeReimbursementPageRoutingModule {}
