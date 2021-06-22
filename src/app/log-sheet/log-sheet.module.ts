import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LogSheetPageRoutingModule } from "./log-sheet-routing.module";
import { LogSheetPage } from "./log-sheet.page";
import { CommonPageModule } from "../common/common.module";
import { ScheduleTaskComponent } from "./schedule-task/schedule-task.component";
import { UnScheduleTaskComponent } from "./un-schedule-task/un-schedule-task.component";
import { PendingTaskComponent } from "./pending-task/pending-task.component";
import { JobCompletedComponent } from "./job-completed/job-completed.component";
import { AddTaskComponent } from "./add-task/add-task.component";
import { JobPendingComponent } from './job-pending/job-pending.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogSheetPageRoutingModule,
    CommonPageModule,
  ],
  declarations: [
    LogSheetPage,
    ScheduleTaskComponent,
    UnScheduleTaskComponent,
    PendingTaskComponent,
    JobPendingComponent,
    JobCompletedComponent,
    AddTaskComponent,
  ],
})
export class LogSheetPageModule {}
