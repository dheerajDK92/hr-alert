import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { UtilService } from "src/app/common/service/util.service";
import { ToastService } from "src/app/common/service/toast.service";
import { LogSheetServiceService } from "src/app/common/service/log-sheet-service.service";
import { EmployeeService } from "src/app/common/service/employee.service";

@Component({
  selector: "app-job-completed",
  templateUrl: "./job-completed.component.html",
  styleUrls: ["./job-completed.component.scss"],
})
export class JobCompletedComponent implements OnInit, OnChanges {
  @Input("empData") empData: any;
  CmpData: any;
  formData = {
    task: null,
    taskFor: null,
    taskDate: null,
  };
  taskList = [];
  constructor(
    private modalController: ModalController,
    private file: File,
    private loader: UtilService,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private _log: LogSheetServiceService,
    private _emp: EmployeeService
  ) {}
  /**
   *
   * @param changes : simple changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.empData) {
      this.empData = changes.empData.currentValue;
    }
  }
  /**
   * ngoninit
   */
  ngOnInit() {
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadTasks();
    this.loadCompletedTasks();
    this.loadCompanyEmp();
  }
  /**
   * load emp
   */
  /**
   *
   * load total emp
   */
  isEmployeeLoading: Subscription;
  empList = [];
  loadCompanyEmp() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.empData.companyId)
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.empList = response.data.employeeList;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this.loader.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * Load Task
   */
  loadTasks() {
    this.taskList = [];
    this._log.loadTask(this.CmpData._id).subscribe(
      (res: any) => {
        this.loader.hideLoader();
        console.log("Res===", res);
        if (res.data.taskDetails?.length > 0) {
          this.taskList = res.data.taskDetails;
        }
      },
      (err) => {
        this.loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }
  /**
   * Cancel the pop up
   */
  cancelPopUp() {
    this.modalController.dismiss();
  }
  /**
   * loadScheduleTasks
   */
  scheduleTaskList = [];
  isloadingTask: Subscription;
  loadCompletedTasks() {
    this.scheduleTaskList = [];
    if (this.isloadingTask) {
      this.isloadingTask.unsubscribe();
    }
    this.isloadingTask = this._log.loadCompleteTask(this.CmpData._id).subscribe(
      (res: any) => {
        this.loader.hideLoader();
        if (res.data.taskDetails?.length > 0) {
          this.scheduleTaskList = res.data.taskDetails;
        }
      },
      (err) => {
        this.loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }
  /**
   * clear the form data
   */
  clearFields() {
    this.formData = {
      task: null,
      taskFor: null,
      taskDate: null,
    };
  }
  /**
   *
   * @param val to check null check
   */
  isNull(val) {
    return val == "" || val == null || val == undefined;
  }
  /**
   * dom filters
   */
  getEmpName(id) {
    const empDetails = this.empList.filter((itm) => itm._id === id);
    if (empDetails.length > 0) {
      return empDetails[0].empname;
    } else {
      return "N.A.";
    }
  }
  getTaskDetail(id) {
    const empDetails = this.taskList.filter((itm) => itm._id === id);
    if (empDetails.length > 0) {
      return `${empDetails[0].areaOfWork}`;
    } else {
      return "N.A.";
    }
  }
  /**
   * cleanup
   */
  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    if (this.isloadingTask) {
      this.isloadingTask.unsubscribe();
    }
  }
}
