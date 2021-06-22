import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SalarySlipPageRoutingModule } from "./salary-slip-routing.module";
import { SalarySlipPage } from "./salary-slip.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPageModule,
    SalarySlipPageRoutingModule,
  ],
  declarations: [SalarySlipPage],
})
export class SalarySlipPageModule {}
