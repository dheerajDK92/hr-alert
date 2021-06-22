import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  ModalController,
  Platform,
  ActionSheetController,
  NavController,
} from "@ionic/angular";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { EventModalPage } from "./eventModal/event-modal.component";
import { UtilService } from '../common/service/util.service';

@Component({
  selector: "app-employee-Leave",
  templateUrl: "./employeeLeave.page.html",
  styleUrls: ["./employeeLeave.page.scss"],
})
export class employeeLeavePage implements OnInit, OnDestroy {
  public main: string;
  skelenton = true;
  EmpData: any = null;
  // template: any;
  // reimbursementByEmploy: any[] = [];
  // showNoEntryForEmployee: boolean = false;
  // expenseDateLimit: String = new Date().toISOString();
  // selectedDay = new Date();
  // selectedObject;
  // eventSource = [];
  // viewTitle;
  // isToday: boolean;
  // calendarModes = [
  //   { key: "month", value: "Month" },
  //   { key: "week", value: "Week" },
  //   { key: "day", value: "Day" },
  // ];
  // calendar = {
  //   mode: this.calendarModes[0].key,
  //   currentDate: new Date(),
  // }; // these are the variable used by the calendar.

  constructor(
    public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private router: Router,
    private _toast: ToastService,
    private _emp: EmployeeService,
    private _util: UtilService
  ) {
    // this.markDisabled(new Date(2017, 12, 25))
  }

  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    setTimeout(() => {
      this.skelenton = false;
      this._util.hideLoader();
    }, 1000);
  }

  /**
   * leaveEvent: modal for user entry
   */
  leaveEvent = {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    allDay: false,
    reason: null,
  };
  reasonList = [
    { id: "Sick Leave", name: "Sick Leave" },
    { id: "Maternal Leave", name: "Maternal Leave" },
    { id: "Paternal Leave", name: "Paternal Leave" },
    { id: "Earned leave", name: "Earned leave" },
    { id: "Other", name: "Other" },
  ];

  minDate: string = new Date().toISOString();
  maxData: any = new Date().getFullYear() + 3;
  private isLeaveLoading: Subscription;

  save() {
    const FinalData = {
      startDate: this.leaveEvent.startDate,
      endDate: this.leaveEvent.endDate,
      allDay: this.leaveEvent.allDay,
      reason: this.leaveEvent.reason,
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      email: this.EmpData.email,
      phone: this.EmpData.phone,
      status: "inProgress",
      hrRemarks: "",
    };
    const valid = this.validateLeaveForm(this.leaveEvent);
    if (valid) {
      if (this.isLeaveLoading) {
        this.isLeaveLoading.unsubscribe();
      }
      this.isLeaveLoading = this._emp.requestLeave(FinalData).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.router.navigate(["/main/Home"]);
            this._toast.showWarning(
              "Your Leave request has been sent to your Reporting Manager. Please check Leave status for future ref."
            );
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    }
  }
  validateLeaveForm(data) {
    let output = true;
    if (data.reason == null || data.reason == undefined || data.reason == "") {
      this._toast.showError("Please Select Leave Reason.");
      output = false;
    }

    return output;
  }
  ngOnDestroy() {
    if (this.isLeaveLoading) {
      this.isLeaveLoading.unsubscribe();
    }
  }
  backButton() {
    this.router.navigate(["/main/Home"]);
  }
}
