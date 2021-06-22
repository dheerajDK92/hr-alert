import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { UtilService } from '../common/service/util.service';

@Component({
  selector: "app-employee-Reimbursement",
  templateUrl: "./employeeReimbursement.page.html",
  styleUrls: ["./employeeReimbursement.page.scss"],
})
export class employeeReimbursementPage implements OnInit, OnDestroy {
  public main: string;
  private isReimburseLoad: Subscription;
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

  submitReimbursementForm(form) {
    const data = {
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      email: this.EmpData.email,
      phone: this.EmpData.phone,
      destination: form.value.destination,
      expenseDate: form.value.expenseDate,
      origin: form.value.origin,
      reimbursementType: form.value.reimbursementType,
      amount: form.value.amount,
      remarks: form.value.remarks,
      hrRemarks: "",
      status: "inProgress",
    };
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
    this.isReimburseLoad = this._emp.requestReimbursement(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.router.navigate(["/main/Home"]);
          this._toast.showWarning(
            "Your Reimbursement request has been sent to your HR. Please check Reimbursement status for future ref."
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
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
  }
}
