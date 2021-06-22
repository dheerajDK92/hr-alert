import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { ApiUrlService } from "../common/service/api-url.service";
import { AddTaskComponent } from "./add-task/add-task.component";
import { JobCompletedComponent } from "./job-completed/job-completed.component";
import { JobPendingComponent } from "./job-pending/job-pending.component";
import { PendingTaskComponent } from "./pending-task/pending-task.component";
import { ScheduleTaskComponent } from "./schedule-task/schedule-task.component";
import { UnScheduleTaskComponent } from "./un-schedule-task/un-schedule-task.component";

@Component({
  selector: "app-log-sheet",
  templateUrl: "./log-sheet.page.html",
  styleUrls: ["./log-sheet.page.scss"],
})
export class LogSheetPage implements OnInit {
  public main: string;
  public EmpData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private _api: ApiUrlService
  ) {}

  ngOnInit() {
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });

    this.main = this.activatedRoute.snapshot.paramMap.get("id");
  }

  openTask(task) {
    if (task == "scheduleTask") {
      this.ScheduleTask();
    } else if (task == "unscheduleTask") {
      this.UnScheduleTask();
    } else if (task == "pendingTask") {
      this.pendingTask();
    } else if (task == "jobCompleted") {
      this.jobCompleted();
    } else if (task == "jobPending") {
      this.jobPending();
    } else if (task == "addTask") {
      this.addTask();
    }
  }
  /**
   *
   */
  async ScheduleTask() {
    const modal = await this.modalController.create({
      component: ScheduleTaskComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
  /**
   *
   */
  async UnScheduleTask() {
    const modal = await this.modalController.create({
      component: UnScheduleTaskComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
  /**
   *
   */
  async pendingTask() {
    const modal = await this.modalController.create({
      component: PendingTaskComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
  /**
   *
   */
  async jobCompleted() {
    const modal = await this.modalController.create({
      component: JobCompletedComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
  /**
   *
   */
  async jobPending() {
    const modal = await this.modalController.create({
      component: JobPendingComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }

  /**
   *
   */
  async addTask() {
    const modal = await this.modalController.create({
      component: AddTaskComponent,
      cssClass: "addTask",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
}
