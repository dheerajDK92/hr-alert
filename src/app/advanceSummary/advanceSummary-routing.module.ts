import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { advanceSummaryPage } from './advanceSummary.page';

const routes: Routes = [
  {
    path: '',
    component: advanceSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class advanceSummaryPageRoutingModule {}
