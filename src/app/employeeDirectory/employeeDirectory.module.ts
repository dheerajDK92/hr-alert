import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { employeeDirectoryPageRoutingModule } from "./employeeDirectory-routing.module";
import { employeeDirectoryPage } from "./employeeDirectory.page";
import { CommonPageModule } from "../common/common.module";
import { EmployeeinfoComponent } from "./employee-info/employee-info.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    employeeDirectoryPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [employeeDirectoryPage, EmployeeinfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class employeeDirectoryPageModule {}
