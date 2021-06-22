import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ModalController } from "@ionic/angular";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { UtilService } from '../common/service/util.service';

@Component({
  selector: "app-advance",
  templateUrl: "./advance.page.html",
  styleUrls: ["./advance.page.scss"],
})
export class advancePage implements OnInit {
  public main: string;
  private isAdvanceLoad: Subscription;
  skelenton = true;
  EmpData: any = null;
  showNoEntryForEmployee: boolean = false;
  expenseDateLimit: String = new Date().toISOString();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private modalController: ModalController,
    private _toast: ToastService,
    private _util: UtilService
  ) {}
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

  backButton() {
    this.router.navigate(["/main/Home"]);
  }

  submitAdvanceForm(form) {
    const data = {
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      email: this.EmpData.email,
      phone: this.EmpData.phone,
      expenseDate: form.value.expenseDate,
      advanceType: form.value.advanceType,
      amount: form.value.amount,
      remarks: form.value.remarks,
      hrRemarks: "",
      status: "inProgress",
    };
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
    this.isAdvanceLoad = this._emp.requestAdvance(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.router.navigate(["/main/Home"]);
          this._toast.showWarning(
            "Your Advance request has been sent to your HR. Please check Advace Summary for future ref."
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

  ngOnDestroy() {
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
  }
}
