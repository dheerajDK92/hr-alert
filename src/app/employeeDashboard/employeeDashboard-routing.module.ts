import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeDashboardPage } from './employeeDashboard.page';

const routes: Routes = [
  {
    path: '',
    component: employeeDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeDashboardPageRoutingModule {}
