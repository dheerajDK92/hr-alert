import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeReimbursementSummaryPage } from './employeeReimbursementSummary.page';

const routes: Routes = [
  {
    path: '',
    component: employeeReimbursementSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeReimbursementSummaryPageRoutingModule {}
