import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeLeaveSummaryPageRoutingModule } from "./employeeLeaveSummary-routing.module";
import { employeeLeaveSummaryPage } from "./employeeLeaveSummary.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeLeaveSummaryPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeeLeaveSummaryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeLeaveSummaryPageModule {}
