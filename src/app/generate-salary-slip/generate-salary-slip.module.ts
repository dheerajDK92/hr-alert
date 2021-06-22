import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { GenerateSalarySlipPageRoutingModule } from "./generate-salary-slip-routing.module";
import { GenerateSalarySlipPage } from "./generate-salary-slip.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPageModule,
    GenerateSalarySlipPageRoutingModule,
  ],
  declarations: [GenerateSalarySlipPage],
})
export class GenerateSalarySlipPageModule {}
