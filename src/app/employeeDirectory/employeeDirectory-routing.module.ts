import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { employeeDirectoryPage } from './employeeDirectory.page';

const routes: Routes = [
  {
    path: '',
    component: employeeDirectoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class employeeDirectoryPageRoutingModule {}
