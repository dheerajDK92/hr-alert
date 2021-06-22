import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalarySlipReportPage } from './salary-slip-report.page';

const routes: Routes = [
  {
    path: '',
    component: SalarySlipReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalarySlipReportPageRoutingModule {}
