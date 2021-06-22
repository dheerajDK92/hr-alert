import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../common/service/authentication.service";
import { environment } from "src/environments/environment";
import { ToastService } from "../common/service/toast.service";
import { CompanyService } from "../common/service/company.service";
@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  @ViewChild("signUpForm", { static: false }) signUp: NgForm;

  constructor(
    private router: Router,
    public navParams: NavParams,
    private _auth: AuthenticationService,
    private _toast: ToastService,
    private CompanyService: CompanyService
  ) {}

  ngOnInit() {
    this.loadCompanyList();
  }

  companies = [];
  sites = [
    "OFFICE ",
    "MPCB PARBHANI MANPOWER",
    "BARC",
    "MPCB AHMEDNAGAR ",
    "MPCB AHMEDNAGAR MANPOWER",
    "MPCB BELAPUR MANPOWER ",
    "MPCB PUNE MANPOWER",
    "MPCB (BELAPUR)",
    "MPCB (CST)",
    "MPCB SION MANPOWER",
    "MPCB (CHIPLUN) ",
    "MPCB  (NAGPUR)",
    "RESERVE BANK OF INDIA",
    "MPCB (PUNE)",
    "MPCB CHANDRAPUR MANPOWER ",
    "MPCB (CHANDRAPUR)",
    "GODREJ (MAINNT)",
    "MPCB (KALYAN)",
    "MPCB (SATARA)",
    "MPCB (SION) ",
    "MPCB AURANGABAD MANPOWER",
    "MPCB (AURANGABAD)",
    "MPCB V/B MANPOWER",
    "MPCB MANTRALAY MANPOWER",
    "MMTC",
    "MPCB (NASHIK) ",
    "TECHNO - HSK",
    "MPCB NAGPUR MANPOWER ",
    "MPCB RATNAGIRI MANPOWER",
    "MPCB (DHULE)",
    "GODREJ (HSK) ",
    "TECHNO - GYM",
    "MPCB (THANE) ",
    "MPCB (MAHAD)",
    "MPCB MAHAPE",
    "MPCB (KOLHAPUR) ",
    "MPCB JALGAON MANPOWER",
    "MPCB (NANDED) ",
    "MPCB RO MUMBAI MANPOWER",
    "MPCB (AMRAVATI)",
    "UDYOG SARATHI",
    "MANTRALAY ",
    "MPCB (AKOLA)",
    "Site 1",
    "MPCB MAHAD MANPOWER",
    "SAMRUDDHI",
    "MPCB (LATUR)",
    "MANTRALAY BORIKAR",
    "MPCB JALGAON",
    "MPCB THANE MANPOWER",
    "MPCB PARBHANI",
    "MPCB BHANDARA",
    "MPCB SHOLAPUR MANPOWER",
    "MPCB RATNAGIRI",
    "MPCB CHIPLUN MANPOWER",
    "MANTRALAY PARYAVARAN",
    "MPCB TARAPUR",
    "MPCB (SANGLI)",
    "MPCB JALNA",
    "MPCB NASHIK MANPOWER",
    "MPCB KOLHAPUR MANPOWER",
    "STATE BANK OF INDIA",
    "MPCB SANGLI MANPOWER",
    "MPCB AMRAVATI MANPOWER",
  ];
  loadCompanyList() {
    this.CompanyService.getCompanyList().subscribe(
      (response: any) => {
        console.log("response", response);
        this.companies = response.data.companies;
      },
      (error) => {
        console.error("error", error);
      }
    );
  }
  companySelected: any = "";
  siteSelected: any = "";
  public async submitForm(form) {
    console.log(" ===>", form.value);

    if (this.isNull(form.value.name)) {
      this._toast.showWarning("Please Enter Employee Name.");
      return;
    }
    if (this.isNull(form.value.password)) {
      this._toast.showWarning("Please Enter Employee Name.");
      return;
    }
    if (this.isNull(form.value.email || form.value.phone)) {
      this._toast.showWarning("Please Enter Email OR Phone.");
      return;
    }
    if (this.isNull(form.value.site)) {
      this._toast.showWarning("Please Select Site Where Are you Working.");
      return;
    }
    if (this.isNull(form.value.companyId)) {
      this._toast.showWarning("Please Select Company.");
      return;
    }

    // success will come here
    const FinalData = {
      empname: form.value.name,
      empID: String(Math.floor(new Date().valueOf() * Math.random())),
      Site: form.value.site,
      isReportingManager: false,
      isMonthlyCalculation: true,
      designation: "",
      DOB: "",
      DOJ: new Date(),
      DOL: "",
      gender: "",
      isHrAdmin: false,
      companyId: form.value.companyId,
      phone: String(form.value.phone),
      email: form.value.email,
      password: form.value.password,
      address: "",
      address2: "",
      pincode: "",
      city: "",
      state: "",
      country: "India",
      description: "",
      startTime: "",
      endtTime: "",
      halfDayApplicable: false,
      minHoursOfHalfDay: "5",
      maxHoursOfContinousWork: "9",
      weeklyOffs: [],
      selfAttendanceMethod: "",
      attendanceFromOffice: true,
      fingerPrintAttendance: false,
      imageWithAttendance: false,
      overTimeApplicable: false,
      BASIC: 0,
      DA: 0,
      SpecialAllowance: 0,
      OtherAllowance: 0,
      HRA: 0,
      TotalEarning: 0,
      ESICEmployer: 0,
      EPFEmployer: 0,
      ESICEmployee: 0,
      EPFEmployee: 0,
      PT: 0,
      MLWF: 0,
      OtherDeduction: 0,
      TotalDeduction: 0,
      NetTotal: 0,
    };

    this.CompanyService.registerEmployee(FinalData).subscribe(
      (response: any) => {
        console.log("response", response);
        this._toast.showWarning("Successfully Registered. Please Login");
        setTimeout(() => {
          this.router.navigate(["/loginWithEmail"]);
        }, 2000);
      },
      (error) => {
        this._toast.showWarning(error.error.error);
      }
    );
  }

  private isNull(value) {
    return value == "" || value == undefined || value == null;
  }
  navigateToLogin(){
    this.router.navigate(["/loginWithEmail"]);
  }
}
