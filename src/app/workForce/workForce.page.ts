import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { UtilService } from "../common/service/util.service";

@Component({
  selector: "app-workForce",
  templateUrl: "./workForce.page.html",
  styleUrls: ["./workForce.page.scss"],
})
export class workForcePage implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private _util: UtilService,
    private _toast: ToastService,
    private _api: ApiUrlService,
    private _emp: EmployeeService
  ) {}
  /**
   * decarations
   */
  public main: string;
  isEmployeeLoading: Subscription;
  isWorkForce: Subscription;
  punchDate: any;
  empList: any[] = [];
  filterList: any[] = [];
  public EmpData: any = null;
  /**
   * initial hook
   */
  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._util.showLoader();
    const dateNow = new Date();
    this.punchDate = `${
      dateNow.getMonth() + 1
    }/${dateNow.getDate()}/${dateNow.getFullYear()}`;

    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });

    this.loadCompanyEmp(null);
  }
  /**
   *
   * load total emp
   */
  loadCompanyEmp(event) {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.EmpData.companyId)
      .subscribe(
        (response: any) => {
          this.loadTodayAvailableEmplyees();
          if (isNullOrUndefined(response.error)) {
            this.empList = response.data.employeeList;
            this.filterList = response.data.employeeList;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
          if (event) event.target.complete();
        },
        (err) => {
          this._util.hideLoader();
          if (event) event.target.complete();
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * get the today available emp
   */
  availableEmployee = [];
  loadTodayAvailableEmplyees() {
    if (this.isWorkForce) {
      this.isWorkForce.unsubscribe();
    }
    this.isWorkForce = this._emp
      .getTodayWorkForce({
        punchDate: this.punchDate,
        companyId: this.EmpData.companyId,
      })
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.availableEmployee = response.data.details;
            this.getAvailableEmployeeDetails();
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * filter for emp availablity
   */
  availableEmpList = [];
  filterAvailableEmpList = [];
  unavailableEmpList = [];
  filterUnavailableEmpList = [];
  getAvailableEmployeeDetails() {
    if (this.availableEmployee.length > 0) {
      for (let itm of this.availableEmployee) {
        for (let i = 0; i < this.empList.length - 1; i++) {
          if (this.empList[i]._id == itm.employeeId) {
            this.availableEmpList.push(this.empList[i]);
          } else {
            this.unavailableEmpList.push(this.empList[i]);
          }
        }
      }
      this.filterAvailableEmpList = [...this.availableEmpList];
      this.filterUnavailableEmpList = [...this.unavailableEmpList];
      this._util.hideLoader();
    } else {
      this.filterUnavailableEmpList = [...this.empList];
      this.unavailableEmpList = [...this.empList];
      this._util.hideLoader();
    }
  }
  /**
   * search
   */
  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.availableEmpList = this.filterAvailableEmpList;
      this.unavailableEmpList = this.filterUnavailableEmpList;
    } else {
      this.availableEmpList = this.filterAvailableEmpList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
      this.unavailableEmpList = this.filterUnavailableEmpList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
    }
  }
  /**
   * CleanUp Phase
   */
  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    if (this.isWorkForce) {
      this.isWorkForce.unsubscribe();
    }
  }
}
