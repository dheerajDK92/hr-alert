import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AssetsPageRoutingModule } from "./assets-routing.module";
import { AssetsPage } from "./assets.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPageModule,
    AssetsPageRoutingModule,
  ],
  declarations: [AssetsPage],
})
export class AssetsPageModule {}
