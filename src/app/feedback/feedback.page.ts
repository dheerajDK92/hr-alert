import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { UtilService } from '../common/service/util.service';

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"],
})
export class feedbackPage implements OnInit, OnDestroy {
  public main: string;
  private isFeedbackLoad: Subscription;
  EmpData: any;
  formValues = {
    title: "",
    description: "",
    mobile: "123456",
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private router: Router,
    private _util: UtilService
  ) {}

  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    setTimeout(()=>{
      this._util.hideLoader();
    },1000);
  }

  openSocial(selectedSocial) {
    console.log("selectedSocial: ", selectedSocial);
  }

  submitFeedbackForm(form) {
    const data = {
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      email: this.EmpData.email,
      phone: this.EmpData.phone,
      description: form.value.description,
    };
    if (this.isFeedbackLoad) {
      this.isFeedbackLoad.unsubscribe();
    }
    this.isFeedbackLoad = this._emp.sendFeedback(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.router.navigate(["/main/Home"]);
          this._toast.showWarning(
            "Successfully feedback send, we will get in touch with you soon."
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
    if (this.isFeedbackLoad) {
      this.isFeedbackLoad.unsubscribe();
    }
  }

  backButton() {
    this.router.navigate(["/main/Home"]);
  }
}
