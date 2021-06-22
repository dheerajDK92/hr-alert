import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeDashboardPageRoutingModule } from "./employeeDashboard-routing.module";
import { employeeDashboardPage } from "./employeeDashboard.page";
import { CommonPageModule } from "../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeDashboardPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeeDashboardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeDashboardPageModule {}
