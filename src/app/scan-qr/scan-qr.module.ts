import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommonPageModule } from "../common/common.module";
import { ScanQrPageRoutingModule } from "./scan-qr-routing.module";
import { ScanQrPage } from "./scan-qr.page";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanQrPageRoutingModule,
    CommonPageModule,
  ],
  providers: [BarcodeScanner],
  declarations: [ScanQrPage],
})
export class ScanQrPageModule {}
