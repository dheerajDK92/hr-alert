import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeLeaveSummaryPage } from './employeeLeaveSummary.page';

const routes: Routes = [
  {
    path: '',
    component: employeeLeaveSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeLeaveSummaryPageRoutingModule {}
