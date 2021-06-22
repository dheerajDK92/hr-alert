import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { monthlyPage } from './monthly.page';

const routes: Routes = [
  {
    path: '',
    component: monthlyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class monthlyPageRoutingModule {}
