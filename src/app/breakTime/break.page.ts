import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { UtilService } from "../common/service/util.service";

@Component({
  selector: "app-break",
  templateUrl: "./break.page.html",
  styleUrls: ["./break.page.scss"],
})
export class breakPage implements OnInit, OnDestroy {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  isStartBreak = true;
  BreakTime;
  pageText = {
    title: `Today's Break Detail`,
    brekGoingOn: `Your Break is Going On`,
    start: "Start",
    stop: "Stop",
    noresult: "No Result Found.",
  };
  startBreakTime: any;
  breakDate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private _loader: UtilService
  ) {}
  currentBreak: any;
  isStopBreakLoading: Subscription;
  isStartBreakLoading: Subscription;
  ngOnInit() {
    this._loader.showLoader();
    const dateNow = new Date();
    this.breakDate = `${
      dateNow.getMonth() + 1
    }/${dateNow.getDate()}/${dateNow.getFullYear()}`;
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    const empDataToSearch = {
      breakDate: this.breakDate,
      employeeId: this.EmpData._id,
    };

    /** fetch current break if going on */
    this._emp.fetchBreak(empDataToSearch).subscribe(
      (response: any) => {
        this._loader.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this.currentBreak = response.data.details;
          if (this.currentBreak.length > 0) {
            if (
              this.currentBreak[0].startTime != "" &&
              this.currentBreak[0].stopTime == ""
            ) {
              this.isStartBreak = false;
            } else {
              this.isStartBreak = true;
            }
          } else {
            this.isStartBreak = true;
          }
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }
  // startTime: any;

  startBreak() {
    if (this.isStartBreakLoading) {
      this.isStartBreakLoading.unsubscribe();
    }
    const dateNow = new Date();
    this.startBreakTime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    const finalData = {
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      breakDate: this.breakDate,
      startTime: this.startBreakTime,
      stopTime: "",
    };
    this._loader.showLoader();
    this._emp.startBreak(finalData).subscribe(
      (response: any) => {
        this._loader.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this._toast.showWarning(
            `Your Break has been started at ${this.startBreakTime}`
          );
          this.ngOnInit();
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }

  stopBreak() {
    if (this.isStopBreakLoading) {
      this.isStopBreakLoading.unsubscribe();
    }
    const dateNow = new Date();
    const stopTime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    const finalData = {
      companyId: this.currentBreak[0].companyId,
      employeeId: this.currentBreak[0].employeeId,
      breakDate: this.currentBreak[0].breakDate,
      startTime: this.currentBreak[0].startTime,
      stopTime: stopTime,
      _id: this.currentBreak[0]._id,
    };
    this._loader.showLoader();
    this._emp.stopBreak(finalData).subscribe(
      (response: any) => {
        this._loader.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this._toast.showWarning(`Your Break has been stopped at ${stopTime}`);
          this.ngOnInit();
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }

  diff_minutes(startTime, StopTime) {
    var date1 = new Date(`08/05/2015 ${startTime}`);
    var date2 = new Date(`08/05/2015 ${StopTime}`);
    var diff = date2.getTime() - date1.getTime();
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return `${hh}:${mm}:${ss.toFixed(2)}`;
  }

  ngOnDestroy() {
    if (this.isStopBreakLoading) {
      this.isStopBreakLoading.unsubscribe();
    }
    if (this.isStartBreakLoading) {
      this.isStartBreakLoading.unsubscribe();
    }
  }
}
