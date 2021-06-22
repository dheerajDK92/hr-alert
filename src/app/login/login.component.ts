import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../common/service/authentication.service";
import { environment } from "src/environments/environment";
import { ToastService } from "../common/service/toast.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("loginForm", { static: false }) loginForm: NgForm;
  mobileForm: boolean = true;
  OTPForm: boolean = false;
  timer: any;
  resendOPTTime = environment.resendOTPTime;
  showResend = false;

  constructor(
    private router: Router,
    public navParams: NavParams,
    private _auth: AuthenticationService,
    private _toast: ToastService
  ) {}

  ngOnInit() {}
  mobileEntered: any;
  public async submitForm(form) {
    this.mobileEntered = form.value.mobile;
    const validMobile = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: need to call api to check mobile no. is registered or not
        try {
          resolve(true);
        } catch (e) {
          reject(false);
        }
      }, 3000);
    });
    validMobile ? this.openOTPForm() : "";
  }

  private openOTPForm() {
    this.mobileForm = false;
    this.OTPForm = true;
    this.timer = setInterval(() => {
      if (this.resendOPTTime == 0) {
        clearTimeout(this.timer);
        this.showResendLink();
      } else {
        this.resendOPTTime--;
      }
    }, 1000);
  }
  OTPtry = 0;
  public async submitOTPForm(form) {
    const otpEntered = form.value.otp;
    this.OTPtry += 1;

    if (this.OTPtry === 3) {
      this._toast.showWarning(
        `OTP is not valid, you have tried ${this.OTPtry} times from maximum limit 3`
      );
      setTimeout(() => {
        location.reload();
      }, 50);
    } else {
      if (otpEntered === environment.dummyOTP) {
        this._toast.showWarning(`Login Successfully.`);
        this.redirectLogin();
      } else {
        this._toast.showWarning(
          `OTP is not valid, you have tried ${this.OTPtry} times from maximum limit 3`
        );
      }
    }
  }

  showResendLink() {
    this.showResend = true;
  }

  resendOTP() {
    this._toast.showWarning(`OTP resent to ${this.mobileEntered}`);
    this.showResend = false;
    // TODO need to add resend OTP API
  }

  private redirectLogin() {
    // this._auth.login();
    this.router.navigate(["/main/MainContent"]);
  }
}
