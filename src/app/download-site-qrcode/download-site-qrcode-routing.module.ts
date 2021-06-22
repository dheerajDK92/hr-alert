import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadSiteQRCodePage } from './download-site-qrcode.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadSiteQRCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadSiteQRCodePageRoutingModule {}
