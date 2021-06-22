import { Component, OnInit } from "@angular/core";
import { ToastService } from "../common/service/toast.service";
import { AuthenticationService } from "../common/service/authentication.service";
import { isNullOrUndefined } from "util";
import { Router } from "@angular/router";
import { UtilService } from "../common/service/util.service";

@Component({
  selector: "app-login-with-email",
  templateUrl: "./login-with-email.component.html",
  styleUrls: ["./login-with-email.component.scss"],
})
export class LoginWithEmailComponent implements OnInit {
  constructor(
    private _toast: ToastService,
    private _auth: AuthenticationService,
    private router: Router,
    private _util: UtilService
  ) {}

  ngOnInit() {}

  submitForm(data) {
    const formData = {
      email: data.value.email,
      password: data.value.password,
    };
    const validData = this.validateData(formData);
    if (validData) {
      this._util.showLoader();
      this._auth.login(formData).subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this._auth.setloginToken(response.data.token);
            this._auth.setUserId(response.data.userid);
            this.redirectLogin();
          } else {
            this._toast.showWarning("Entered Email/Password is wrong. Please try again");
          }
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning("Entered Email/Password is wrong. Please try again");
        }
      );
      // login call
    }
  }
  emailValid = (val: string): boolean =>
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(
      val
    );

  validateData(data) {
    let output = true;
    // if (data.email) {
    //   if (!this.emailValid(data.email)) {
    //     output = false;
    //     this._toast.showWarning("Please Enter Valid Email Address.");
    //   }
    // }
    if (data.email) {
      if (data.email == "" || data.email == null || data.email == undefined) {
        output = false;
        this._toast.showWarning("Please Enter Valid Phone/Email Address.");
      }
    }
    if (!data.password) {
      output = false;
      this._toast.showWarning("Please Enter Valid Password.");
    }
    return output;
  }

  private redirectLogin() {
    this.router.navigate(["/main/MainContent"]);
  }
  navigateToSignUp() {
    this.router.navigate(["/signUp"]);
  }
}
