import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogSheetPage } from './log-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: LogSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogSheetPageRoutingModule {}
