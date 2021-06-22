import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateSalarySlipPage } from './generate-salary-slip.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateSalarySlipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateSalarySlipPageRoutingModule {}
