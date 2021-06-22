import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeLeavePage } from './employeeLeave.page';

const routes: Routes = [
  {
    path: '',
    component: employeeLeavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeLeavePageRoutingModule {}
