import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { ToastService } from "src/app/common/service/toast.service";
import { isNullOrUndefined } from "util";
import { EmployeeService } from "src/app/common/service/employee.service";
import { forkJoin } from "rxjs";
import { UtilService } from 'src/app/common/service/util.service';

@Component({
  selector: "app-employee-update",
  templateUrl: "./employee-update.component.html",
  styleUrls: ["./employee-update.component.scss"],
})
export class EmployeeUpdateComponent implements OnInit {
  @Input("empData") empData: any;
  // empData;
  constructor(
    private modalController: ModalController,
    private _toast: ToastService,
    private _emp: EmployeeService,
    private alertController: AlertController,
    private _util: UtilService
  ) {}
  ngOnInit() {
    this.formData = this.empData;
    const getBankDetail = this._emp.getBankDetails(this.formData._id);
    const requestArray = [getBankDetail];
    this._util.showLoader();
    forkJoin(requestArray).subscribe((results: any) => {
      this._util.hideLoader();
      const bankAccountDetails = results[0];
      this.setBankAccountDetailsData(bankAccountDetails);
    });
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }

  personalInfoSection = true;
  rulesSection = true;
  paymentInfoSection = true;
  addressDetailsSection = true;
  formData: any;
  submitUpdateCompanyForm(submited: any) {
    const FinalData = {
      empname: this.formData.empname,
      empID: this.formData.empID,
      Site: this.formData.Site,
      isReportingManager: this.formData.isReportingManager,
      isMonthlyCalculation: this.formData.isMonthlyCalculation,
      designation: this.formData.designation,
      DOB: this.formData.DOB,
      DOJ: this.formData.DOJ,
      DOL: this.formData.DOL,
      gender: this.formData.gender,
      isHrAdmin: this.formData.isHrAdmin,
      companyId: this.formData.companyId,
      phone: this.formData.phone,
      email: this.formData.email,
      password: this.formData.password,
      address: this.formData.address,
      address2: this.formData.address2,
      pincode: this.formData.pincode,
      city: this.formData.city,
      state: this.formData.state,
      country: this.formData.country,
      description: this.formData.description,
      startTime: this.ReturnSelectedTime(this.formData.startTime),
      endtTime: this.ReturnSelectedTime(this.formData.endtTime),
      halfDayApplicable: this.formData.halfDayApplicable,
      minHoursOfHalfDay: this.formData.minHoursOfHalfDay,
      maxHoursOfContinousWork: this.formData.maxHoursOfContinousWork,
      weeklyOffs: this.formData.weeklyOffs,
      selfAttendanceMethod: this.formData.selfAttendanceMethod,
      attendanceFromOffice: this.formData.attendanceFromOffice,
      fingerPrintAttendance: false,
      imageWithAttendance: this.formData.imageWithAttendance,
      overTimeApplicable: this.formData.overTimeApplicable,
      BASIC: this.formData.BASIC,
      DA: this.formData.DA,
      SpecialAllowance: this.formData.SpecialAllowance,
      OtherAllowance: this.formData.OtherAllowance,
      HRA: this.formData.HRA,
      TotalEarning: this.formData.TotalEarning,
      ESICEmployer: this.formData.ESICEmployer,
      EPFEmployer: this.formData.EPFEmployer,
      ESICEmployee: this.formData.ESICEmployee,
      EPFEmployee: this.formData.EPFEmployee,
      PT: this.formData.PT,
      MLWF: this.formData.MLWF,
      OtherDeduction: this.formData.OtherDeduction,
      TotalDeduction: this.formData.TotalDeduction,
      NetTotal: this.formData.NetTotal,
      _id: this.formData._id,
    };
    const validData = this.validateEnteredData(FinalData);
    if (validData) {
      this._emp.updateEmployee(FinalData).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.modalController.dismiss({ updated: true });
            this._toast.showWarning("Successfully Employee Updated!");
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

  validDobSelected = false;
  validateEnteredData(formData) {
    let output = true;
    const joiningDate = new Date(formData.DOJ);
    const leavingDate = new Date(formData.DOL);
    const currentAge = this.calculateEmpAge(new Date(formData.DOB));
    // Empty Field Validation
    if (
      this.isNullEmpty(formData.empID) ||
      this.isNullEmpty(formData.empname) ||
      this.isNullEmpty(formData.password) ||
      this.isNullEmpty(formData.Site)
    ) {
      let msg = "Please enter/select";
      this.isNullEmpty(formData.empID) ? (msg += " `Employment ID`") : "";
      this.isNullEmpty(formData.empname) ? (msg += " `Employment Name`") : "";
      this.isNullEmpty(formData.password)
        ? (msg += " `Employment Password`")
        : "";
      this.isNullEmpty(formData.Site) ? (msg += " `Site`") : "";
      this._toast.showError(msg);
      output = false;
    }
    if (currentAge < 20) {
      this._toast.showError(
        "Employee age should be greater or equal to 20 Years as per Govt. Rules."
      );
      this.validDobSelected = true;
      output = false;
    }
    if (joiningDate > leavingDate) {
      this._toast.showError(
        "Employee company leaving date should be greater than joining date."
      );
      output = false;
    }

    return output;
  }

  isNullEmpty(value) {
    return value == "" || value == null || value == undefined;
  }

  calculateEmpAge(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  showSecion(sectionClicked) {
    if (sectionClicked == "personalInfoSection") {
      this.validateScreenVisible("personalInfoSection");
    } else if (sectionClicked == "rulesSection") {
      this.validateScreenVisible("rulesSection");
    } else if (sectionClicked == "paymentInfoSection") {
      this.validateScreenVisible("paymentInfoSection");
    } else if (sectionClicked == "addressDetailsSection") {
      this.validateScreenVisible("addressDetailsSection");
    }
  }

  ReturnSelectedTime(time) {
    return String(time.split("T")[1]).substr(0, 5);
  }

  displayProp(name) {
    return document.getElementById(name).style.display;
  }
  setDisplayProp(id, value) {
    document.getElementById(id).style.display = value;
  }

  validateScreenVisible(name) {
    if (this.displayProp(name) == "none") {
      this.setDisplayProp(name, "block");
      document.getElementById(name).style.display = "block";
    } else {
      this.setDisplayProp(name, "none");
      document.getElementById(name).style.display = "none";
    }
  }

  async deleteEmp() {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
        Your added employee '${this.formData.empname}' will permanently delete. If you want to proceed please click on Confirm.`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondaryButton",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Confirm",
          cssClass: "primaryButton",
          handler: () => {
            this._emp.deleteEmployee(this.formData).subscribe(
              (response: any) => {
                if (isNullOrUndefined(response.error)) {
                  this.modalController.dismiss({ updated: true });
                  this._toast.showWarning(
                    `${this.formData.empname} is successfully deleted.`
                  );
                } else {
                  this._toast.showWarning(
                    "Something Went Wrong. Please try again"
                  );
                }
              },
              (err) => {
                this._toast.showWarning(err.error.error);
              }
            );
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }
  DetailSegment = true;
  segmentChanged(ev: any) {
    if (ev.detail.value == "detail") {
      this.DetailSegment = true;
    } else {
      this.DetailSegment = false;
    }
  }

  panCardSegment = true;
  addressProffSection = false;
  bankDetailSection = false;
  segmentChanged2(event) {
    const selectedSegment = event.detail.value;
    if (selectedSegment == "panCardSegment") {
      this.panCardSegment = true;
      this.addressProffSection = false;
      this.bankDetailSection = false;
    } else if (selectedSegment == "addressProffSection") {
      this.panCardSegment = false;
      this.addressProffSection = true;
      this.bankDetailSection = false;
    } else if (selectedSegment == "bankDetailSection") {
      this.panCardSegment = false;
      this.addressProffSection = false;
      this.bankDetailSection = true;
    }
  }

  submitPanCardForm(data) {
    console.log("data", data);
  }
  IFSCValidated = false;
  ifscValidatedData: any;

  clearISFC() {
    this.IFSCValidated = false;
    this.ifscValidatedData = null;
  }

  verifyIFSC(ifsc) {
    if (ifsc !== "" && ifsc !== null && ifsc !== undefined) {
      this._emp.validateIFSC(ifsc).subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            if (response.data.result) {
              this.IFSCValidated = true;
              this.ifscValidatedData = response.data.result;
            }
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
    } else {
      this._toast.showWarning("Please enter valid IFSC code.");
    }
  }

  setBankAccountDetailsData(data): any {
    if (data.data.result.length > 0) {
      const value = data.data.result[0];
      this.AccountHolderName = value.name;
      this.bankAccountNumber = value.bankAccountNumber;
      this.IFSCValidated = true;
      this.ifscValidatedData = value;
    }
  }
  AccountHolderName: any = "";
  AccountHolderMobileNumber: any;
  bankAccountNumber: any = "";
  ifsc: any = "";
  saveBankAcccount() {
    const Data = {
      companyId: this.formData.companyId,
      employeeId: this.formData._id,
      name: this.AccountHolderName,
      bankAccountNumber: this.bankAccountNumber,
      IFSC: this.ifscValidatedData.IFSC,
      BRANCH: this.ifscValidatedData.BRANCH,
      BANK: this.ifscValidatedData.BANK,
      BANKCODE: this.ifscValidatedData.BANKCODE,
      CENTRE: this.ifscValidatedData.CENTRE,
      CITY: this.ifscValidatedData.CITY,
      DISTRICT: this.ifscValidatedData.DISTRICT,
      STATE: this.ifscValidatedData.STATE,
      ADDRESS: this.ifscValidatedData.ADDRESS,
      CONTACT: this.ifscValidatedData.CONTACT,
      UPI: this.ifscValidatedData.UPI,
      RTGS: this.ifscValidatedData.RTGS,
      NEFT: this.ifscValidatedData.NEFT,
      IMPS: this.ifscValidatedData.IMPS,
      MICR: this.ifscValidatedData.MICR,
      isVerified: false,
    };
    this._emp.saveBankDetails(Data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          if (response.data.message == "Success") {
            this._toast.showWarning(
              `Successfully Updated The Bank Details of '${this.formData.empname}'`
            );
          }
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._toast.showWarning(err.error.error);
      }
    );
  }
  /**
   * calculation - start
   */
  manualCalculation: boolean = true;
  manualCalChange(event) {
    this.manualCalculation = event.detail.checked;
  }
  calculateSalary() {
    if (this.manualCalculation) {
      this.formData.HRA = Math.round(this.getPerc(this.formData.BASIC + this.formData.DA, 100 - 5));
      this.formData.EPFEmployee = Math.round(
        this.getPerc(this.formData.BASIC + this.formData.DA, 100 - 12)
      );
      this.formData.EPFEmployer = Math.round(
        this.getPerc(this.formData.BASIC + this.formData.DA, 100 - 13)
      );
      this.formData.TotalEarning = Math.round(
        this.formData.HRA +
          this.formData.BASIC +
          this.formData.DA +
          this.formData.SpecialAllowance +
          this.formData.OtherAllowance
      );
      if (this.formData.gender == "female") {
        this.formData.PT = this.formData.TotalEarning > 10000 ? 200 : 0;
      } else if (this.formData.gender == "male") {
        this.formData.PT =
          this.formData.TotalEarning > 10000 ? 200 : this.formData.TotalEarning > 7500 ? 175 : 0;
      } else {
        this.formData.PT =
          this.formData.TotalEarning > 10000 ? 200 : this.formData.TotalEarning > 7500 ? 175 : 0;
      }
      this.formData.ESICEmployee = Math.round(
        this.getPerc(this.formData.TotalEarning, 100 - 0.75)
      );
      this.formData.ESICEmployer = Math.round(
        this.getPerc(this.formData.TotalEarning, 100 - 3.25)
      );
      this.formData.TotalDeduction = Math.round(
        this.formData.EPFEmployee +
          this.formData.EPFEmployer +
          this.formData.ESICEmployee +
          this.formData.ESICEmployer +
          this.formData.PT +
          this.formData.MLWF +
          this.formData.OtherDeduction
      );
      this.formData.NetTotal = Math.round(this.formData.TotalEarning - this.formData.TotalDeduction);
    }
  }

  getPerc(num, percent) {
    return Number(num) - (Number(percent) / 100) * Number(num);
  }
  /**
   * calculation - end
   */
}
