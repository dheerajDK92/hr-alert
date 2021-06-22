import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CommonPageModule } from "../common/common.module";
import { IonicModule } from "@ionic/angular";
import { DownloadSiteQRCodePageRoutingModule } from "./download-site-qrcode-routing.module";
import { DownloadSiteQRCodePage } from "./download-site-qrcode.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadSiteQRCodePageRoutingModule,
    CommonPageModule,
  ],
  declarations: [DownloadSiteQRCodePage],
})
export class DownloadSiteQRCodePageModule {}
