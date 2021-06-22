import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeReimbursementSummaryPageRoutingModule } from "./employeeReimbursementSummarySummary-routing.module";
import { employeeReimbursementSummaryPage } from "./employeeReimbursementSummary.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeReimbursementSummaryPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeeReimbursementSummaryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeReimbursementPageModule {}
