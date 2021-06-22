import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Platform } from "@ionic/angular";
import { UtilService } from "../common/service/util.service";
import { GLOBAL } from '../common/commonDeclare';

@Component({
  selector: "app-generate-salary-slip",
  templateUrl: "./generate-salary-slip.page.html",
  styleUrls: ["./generate-salary-slip.page.scss"],
})
export class GenerateSalarySlipPage implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private _emp: EmployeeService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private _util: UtilService
  ) {}
  /**
   * variable declaration
   */
  EmpData: any;
  CmpData: any;
  main: String = "";
  isEmployeeLoading: Subscription;
  employees: any[] = [];
  formData: any = {
    employee: null,
    month: null,
  };
  /**
   * ngonit
   */
  ngOnInit() {
    this._util.showLoader();
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });

    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this.loadCompanyEmp();
  }

  /**
   * load company employee details
   */
  loadCompanyEmp() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.EmpData.companyId)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.employees = response.data.employeeList;
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Employee Loading. Please try again"
            );
          }
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * Null check
   */
  isNull(val) {
    return val == "" || val == null || val == undefined;
  }
  /**
   * diff times
   */
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

  /**
   * generateSlip
   */
  isMonthlyAttendanceLoading: Subscription;
  Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthLast = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  attendanceList: any[] = [];
  totalDaysOnMonth: any;
  isShownSalarySlipSection = false;
  fetchDetails() {
    this._util.showLoader();
    this.isShownSalarySlipSection = false;
    if (this.isMonthlyAttendanceLoading) {
      this.isMonthlyAttendanceLoading.unsubscribe();
    }
    const finalData = {
      employeeId: this.formData.employee._id,
      month: new Date(this.formData.month).getMonth(),
      year: new Date(this.formData.month).getFullYear(),
      lastDate: this.monthLast[
        this.Month[new Date(this.formData.month).getMonth() + 1]
      ],
    };
    /** calculate sat sun */
    this.calculateSatSunMonth(new Date(this.formData.month));
    /**Total Days */
    this.totalDaysOnMonth = this.monthLast[
      this.Month[new Date(this.formData.month).getMonth() + 1]
    ];

    this.isMonthlyAttendanceLoading = this._emp
      .getMonthlyAttendance(finalData)
      .subscribe(
        (response: any) => {
          this.isShownSalarySlipSection = true;
          if (isNullOrUndefined(response.error)) {
            this.attendanceList = response.data.punchDetails;
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Attendance Loading. Please try again"
            );
          }
          this.calculateSalary();
          this._util.hideLoader();
        },
        (err) => {
          this._util.hideLoader();
          this.isShownSalarySlipSection = false;
          this._toast.showWarning(err.error.error);
        }
      );
  }

  /**
   * calculateSalary
   */
  finalCalculation = {
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
  calculateSalary() {
    const BASIC =
      this.formData.employee.BASIC == null ? 0 : this.formData.employee.BASIC;
    const DA =
      this.formData.employee.DA == null ? 0 : this.formData.employee.DA;
    const SpecialAllowance =
      this.formData.employee.SpecialAllowance == null
        ? 0
        : this.formData.employee.SpecialAllowance;
    const OtherAllowance =
      this.formData.employee.OtherAllowance == null
        ? 0
        : this.formData.employee.OtherAllowance;
    let HRA = this.formData.employee.HRA;
    let TotalEarning = this.formData.employee.TotalEarning;
    let ESICEmployer = this.formData.employee.ESICEmployer;
    let EPFEmployer = this.formData.employee.EPFEmployer;
    let ESICEmployee = this.formData.employee.ESICEmployee;
    let EPFEmployee = this.formData.employee;
    let PT = this.formData.employee.PT == null ? 0 : this.formData.employee.PT;
    let MLWF =
      this.formData.employee.MLWF == null ? 0 : this.formData.employee.MLWF;
    let OtherDeduction =
      this.formData.employee.OtherDeduction == null
        ? 0
        : this.formData.employee.OtherDeduction;
    let TotalDeduction = this.formData.employee.TotalDeduction;
    let NetTotal =
      this.formData.employee.NetTotal == null
        ? 0
        : this.formData.employee.NetTotal;
    let totalMonthWorkingHours =
      (this.totalDaysOnMonth -
        (this.sunForMonth.length + this.satForMonth.length)) *
      9;
    /** Per hour */
    const perHourSalary = Math.round(NetTotal / totalMonthWorkingHours);
    const perHourForBasic = Math.round(BASIC / totalMonthWorkingHours);
    const perHourForDA = Math.round(DA / totalMonthWorkingHours);
    const perHourForSpecialAllowance = Math.round(
      SpecialAllowance / totalMonthWorkingHours
    );
    const perHourForOtherAllowance = Math.round(
      OtherAllowance / totalMonthWorkingHours
    );
    /**per hour */
    let TotalHourLoggedInForMonth = [];
    for (let itm of this.attendanceList) {
      /**
       * auto calculating the 9 hours if user did not log out
       */
      let stopTime = itm.stopTime;
      if (stopTime == "") {
        stopTime = `${parseInt(itm.startTime.substr(0, 2)) + 9}:00:00`;
      }
      TotalHourLoggedInForMonth.push(
        this.diff_minutes(itm.startTime, stopTime)
      );
    }
    let timearray = [];
    for (let itm of TotalHourLoggedInForMonth) {
      timearray.push(this.timestrToSec(itm));
    }
    let totalTime = 0;
    if(timearray.length > 0){
      totalTime =
      timearray.reduce(function (a, b) {
        return a + b;
      }) /
      60 /
      60;
    }
  
    /**
     * Console All calculations result
     */

    const TotalEarningCal = Math.round(
      // Math.round(
      //   this.getPerc(
      //     totalTime * perHourForBasic + totalTime * perHourForDA,
      //     100 - 5
      //   )
      // ) +
      Math.round(totalTime * perHourForBasic) +
        Math.round(totalTime * perHourForDA) +
        Math.round(totalTime * perHourForSpecialAllowance) +
        Math.round(totalTime * perHourForOtherAllowance)
    );

    const TotalDeductionCal = Math.round(
      Math.round(
        this.getPerc(
          totalTime * perHourForBasic + totalTime * perHourForDA,
          100 - 12
        )
      ) +
        // Math.round(
        //   this.getPerc(
        //     totalTime * perHourForBasic + totalTime * perHourForDA,
        //     100 - 13
        //   )
        // ) +
        Math.round(this.getPerc(TotalEarningCal, 100 - 0.75)) +
        // Math.round(this.getPerc(TotalEarningCal, 100 - 3.25)) +
        PT +
        MLWF +
        OtherDeduction
    );

    this.finalCalculation.BASIC = Math.round(totalTime * perHourForBasic);
    this.finalCalculation.DA = Math.round(totalTime * perHourForDA);
    this.finalCalculation.SpecialAllowance = Math.round(
      totalTime * perHourForSpecialAllowance
    );
    this.finalCalculation.OtherAllowance = Math.round(
      totalTime * perHourForOtherAllowance
    );
    this.finalCalculation.HRA = Math.round(
      this.getPerc(
        totalTime * perHourForBasic + totalTime * perHourForDA,
        100 - 5
      )
    );
    this.finalCalculation.EPFEmployee = Math.round(
      this.getPerc(
        totalTime * perHourForBasic + totalTime * perHourForDA,
        100 - 12
      )
    );
    // this.finalCalculation.EPFEmployer = Math.round(
    //   this.getPerc(
    //     totalTime * perHourForBasic + totalTime * perHourForDA,
    //     100 - 13
    //   )
    // );
    this.finalCalculation.TotalEarning = TotalEarningCal;
    this.finalCalculation.TotalDeduction = TotalDeductionCal;
    this.finalCalculation.ESICEmployee = Math.round(
      this.getPerc(TotalEarningCal, 100 - 0.75)
    );
    // this.finalCalculation.ESICEmployer = Math.round(
    //   this.getPerc(TotalEarningCal, 100 - 3.25)
    // );
    this.finalCalculation.NetTotal = Math.round(
      TotalEarningCal - TotalDeductionCal
    );
    this.finalCalculation.PT =
      this.formData.employee.PT == null ? 0 : this.formData.employee.PT;
    this.finalCalculation.OtherDeduction =
      this.formData.employee.OtherDeduction == null
        ? 0
        : this.formData.employee.OtherDeduction;
    this.finalCalculation.MLWF =
      this.formData.employee.MLWF == null ? 0 : this.formData.employee.MLWF;

    console.log("timearray ===>", timearray);
    console.log("TotalHourLoggedInForMonth ===>", TotalHourLoggedInForMonth);
    console.log("totalTime ===>", totalTime);
    console.log("total net Net income ===>", totalTime * perHourSalary);
    console.log("total net perHourForBasic ===>", totalTime * perHourForBasic);
    console.log("total net perHourForDA ===>", totalTime * perHourForDA);
    console.log(
      "total net perHourForSpecialAllowance ===>",
      totalTime * perHourForSpecialAllowance
    );
    console.log(
      "total net perHourForOtherAllowance ===>",
      totalTime * perHourForOtherAllowance
    );
    console.log(
      "total net HRA ===>",
      this.getPerc(
        totalTime * perHourForBasic + totalTime * perHourForDA,
        100 - 5
      )
    );
    console.log(
      "total net EPFEmployee ===>",
      this.getPerc(
        totalTime * perHourForBasic + totalTime * perHourForDA,
        100 - 12
      )
    );
    console.log(
      "total net EPFEmployer ===>",
      this.getPerc(
        totalTime * perHourForBasic + totalTime * perHourForDA,
        100 - 13
      )
    );

    console.log("total net TotalEarning ===>", TotalEarningCal);
    console.log("total net TotalDeduction ===>", TotalDeductionCal);

    console.log(
      "total net ESICEmployee ===>",
      this.getPerc(TotalEarningCal, 100 - 0.75)
    );
    console.log(
      "total net ESICEmployer ===>",
      this.getPerc(TotalEarningCal, 100 - 3.25)
    );

    console.log("perHourSalary ===>", perHourSalary);
    console.log("totalMonthWorkingHours ===>", totalMonthWorkingHours);
    console.log("attendanceList ===>", this.attendanceList);
    /**
     * Calculations End
     */
  }

  getPerc(num, percent) {
    return Number(num) - (Number(percent) / 100) * Number(num);
  }
  /**
   * downloadPaySlip
   */
  downloadPaySlip() {
    console.log(this.finalCalculation);
    this.createLeavePdf();
  }
  /**
   * create pdf
   */
  pdfObj = null;
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  createLeavePdf() {
    /**
     * creating the pdf data - start
     */
    const finalValuestoPrint = [
      [this.CmpData.companyName],
      ["SALARY PAYBALE FOR THE MONTH OF", this.formData.month],
    ];

    const finalPage = [
      // {
      //   text: `${this.CmpData.companyName}`,
      //   style: "header",
      //   color: "blue",
      //   bold: true,
      //   alignment: "center",
      // },
      {
        image: GLOBAL.logo,
        alignment: "left",
      },
      {
        text: `PAY SLIP - ${
          this.monthNames[new Date(this.formData.month).getMonth()]
        }-${new Date(this.formData.month).getFullYear()}`,
        bold: true,
        alignment: "center",
      },
      { text: ` `, alignment: "center" },
      { text: ` `, alignment: "center" },
      // { text: new Date().toTimeString(), alignment: "right" },
      { text: ``, alignment: "center" },
      {
        layout: "lightHorizontalLines", // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["*", "auto", 100, "*"],
          body: [
            ["", "", ``, ""], // `${this.CmpData.companyName}
            [
              "EMP NAME",
              `${this.formData.employee.empname}`,
              "EMP ID",
              `${this.formData.employee.empID}`,
            ],
            [
              { text: "EARNING", bold: true },
              "",
              { text: "DEDUCTION", bold: true },
              "",
            ],
            [
              { text: "BASIC" },
              `${this.finalCalculation.BASIC}`,
              { text: "EPFEmployee" },
              `${this.finalCalculation.EPFEmployee}`,
            ],
            [
              { text: "DA" },
              `${this.finalCalculation.DA}`,
              { text: "ESICEmployee" },
              `${this.finalCalculation.ESICEmployee}`,
              // { text: "EPFEmployer" },
              // `${this.finalCalculation.EPFEmployer}`,
            ],
            [
              { text: "SpecialAllowance" },
              `${this.finalCalculation.SpecialAllowance}`,
              { text: "PT" },
              `${this.finalCalculation.PT}`,
            ],
            [
              { text: "OtherAllowance" },
              `${this.finalCalculation.OtherAllowance}`,
              ``,
              ``,
            ],
            [
              { text: "" },
              ``,
              { text: "MLWF" },
              `${this.finalCalculation.MLWF}`,
            ],
            [
              { text: "" },
              ``,
              { text: "OtherDeduction" },
              `${this.finalCalculation.OtherDeduction}`,
            ],
            [
              { text: "GROSS EARNING", bold: true },
              { text: `${this.finalCalculation.TotalEarning}`, bold: true },
              { text: "GROSS DEDUCTION", bold: true },
              { text: `${this.finalCalculation.TotalDeduction}`, bold: true },
            ],
            [
              { text: "NET EARNING", bold: true },
              { text: `${this.finalCalculation.NetTotal}`, bold: true },
              { text: "" },
              { text: `` },
            ],
          ],
        },
      },
      {
        text: "System generated no seal / signature required.",
        alignment: "left",
      },
    ];
    /**
     * looping the filtered employee site vise - start
     */

    /**
     * looping the filtered employee site vise - end
     */
    var docDefinition = {
      watermark: {
        text: `${this.CmpData.companyName}`,
        color: "blue",
        opacity: 0.1,
        bold: false,
        italics: false,
      },
      content: finalPage,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        this.file
          .writeFile(this.file.dataDirectory, "reimbursements.pdf", blob, {
            replace: true,
          })
          .then((fileEntry) => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(
              this.file.dataDirectory + "reimbursements.pdf",
              "application/pdf"
            );
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  /**
   * pdf end
   */
  /**
   * send to emp
   */
  sendToEmployee() {
    const FinalData = {
      month: `${
        this.monthNames[new Date(this.formData.month).getMonth()]
      }-${new Date(this.formData.month).getFullYear()}`,
      empName: `${this.formData.employee.empname}`,
      empId: `${this.formData.employee.empID}`,
      empUID: `${this.formData.employee._id}`,
      BASIC: `${this.finalCalculation.BASIC}`,
      DA: `${this.finalCalculation.DA}`,
      SpecialAllowance: `${this.finalCalculation.SpecialAllowance}`,
      OtherAllowance: `${this.finalCalculation.OtherAllowance}`,
      GROSSEARNING: `${this.finalCalculation.TotalEarning}`,
      EPFEmployee: `${this.finalCalculation.EPFEmployee}`,
      ESICEmployee: `${this.finalCalculation.ESICEmployee}`,
      PT: `${this.finalCalculation.PT}`,
      MLWF: `${this.finalCalculation.MLWF}`,
      OtherDeduction: `${this.finalCalculation.OtherDeduction}`,
      GROSSDEDUCION: `${this.finalCalculation.TotalDeduction}`,
      NETEARNING: `${this.finalCalculation.NetTotal}`,
      companyId: `${this.formData.employee.companyId}`,
    };
    this._util.showLoader();
    this._emp
      .sendSalarySlip(FinalData)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.isShownSalarySlipSection = false;
            this._toast.showWarning(
              `Salary Slip Has Been Successfully Sent To ${FinalData.empName} For ${FinalData.month}`
            );          
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Employee Loading. Please try again"
            );
          }
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
    console.log("===>", FinalData);
    // TODO: Need to make Save Call

  }
  /**
   * saturday sunday lins
   */

  satForMonth: any;
  sunForMonth: any;
  calculateSatSunMonth(d) {
    let pred = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let nowd;
    let sat_array = "";
    let sun_array = "";

    for (let i = 1; i <= pred; i++) {
      try {
        console.log(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + i);
        nowd = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + i);
        if (nowd.getUTCDay() == 5) {
          sat_array = sat_array + "," + i;
        }

        if (nowd.getUTCDay() == 6) {
          sun_array = sun_array + "," + i;
        }
      } catch (e) {
        return;
      }
    }
    let satArray = sat_array.split(",");
    satArray.shift(); // remove first index
    let sunArray = sun_array.split(",");
    sunArray.shift(); // remove first index
    this.satForMonth = satArray;
    this.sunForMonth = sunArray;
  }

  /**
   * sum of time
   */

  timestrToSec(timestr) {
    var parts = timestr.split(":");
    return parts[0] * 3600 + parts[1] * 60 + +parts[2];
  }

  pad(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  formatTime(seconds) {
    return [
      this.pad(Math.floor(seconds / 3600)),
      this.pad(Math.floor(seconds / 60) % 60),
      this.pad(seconds % 60),
    ].join(":");
  }
  /**
   * sum of time end
   */
  /**
   * on destroy
   */
  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    if (this.isMonthlyAttendanceLoading) {
      this.isMonthlyAttendanceLoading.unsubscribe();
    }
  }
}
