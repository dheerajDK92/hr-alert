import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeReimbursementPageRoutingModule } from "./employeeReimbursement-routing.module";
import { employeeReimbursementPage } from "./employeeReimbursement.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeReimbursementPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeeReimbursementPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeReimbursementPageModule {}
