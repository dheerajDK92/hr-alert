import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeLeavePageRoutingModule } from "./employeeLeave-routing.module";
import { employeeLeavePage } from "./employeeLeave.page";
import { CommonPageModule } from "../common/common.module";
import { EventModalPage } from "./eventModal/event-modal.component";
import { NgCalendarModule } from "ionic2-calendar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeLeavePageRoutingModule,
    CommonPageModule,
    NgCalendarModule,
  ],
  declarations: [employeeLeavePage, EventModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeLeavePageModule {}
