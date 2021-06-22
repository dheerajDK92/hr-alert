import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiUrlService } from "../common/service/api-url.service";
import { ExportToCsv } from "export-to-csv";
import { ToastService } from "../common/service/toast.service";
import { UtilService } from "../common/service/util.service";
import { EmployeeService } from "../common/service/employee.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-salary-slip-report",
  templateUrl: "./salary-slip-report.page.html",
  styleUrls: ["./salary-slip-report.page.scss"],
})
export class SalarySlipReportPage implements OnInit {
  constructor(
    private _api: ApiUrlService,
    private activatedRoute: ActivatedRoute,
    private _toast: ToastService,
    private _util: UtilService,
    private _emp: EmployeeService,
    private file: File,
    private fileOpener: FileOpener,
    private plt: Platform
  ) {}
  EmpData: any;
  CmpData: any;
  main: String = "";
  ngOnInit() {
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });

    this.main = this.activatedRoute.snapshot.paramMap.get("id");
  }

  /**
   * searchSalaryByMonth
   */
  monthForSalary = "";
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
  salaryDetails = [];
  salaryMonth = "";
  uniqueSite = [];
  pdfObj = null;
  searchSalaryByMonth() {
    if (
      this.monthForSalary !== undefined &&
      this.monthForSalary !== null &&
      this.monthForSalary !== ""
    ) {
      this.salaryMonth = `${
        this.monthNames[new Date(this.monthForSalary).getMonth()]
      }-${new Date(this.monthForSalary).getFullYear()}`;

      this._util.showLoader();
      let data = {
        month: this.salaryMonth,
        companyID: this.CmpData._id,
      };
      this._emp.getSalaryDetailsByMonth(data).subscribe(
        (response: any) => {
          this.salaryDetails = response.data.salaryDetails;
          if (this.salaryDetails.length > 0) {
            this.uniqueSite = [
              ...new Set(response.data.salaryDetails.map((obj) => obj.SITE)),
            ];
          }
          this._util.hideLoader();
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
    } else {
      this.salaryMonth = "";
    }
  }
  /**
   * downloadSalaryReports
   */
  downloadSalaryReports() {
    console.log("downloadSalaryReports ===>");
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Emp Id", bold: false },
        { text: "Emp Name", bold: false },
        { text: "Griss Fixed", bold: false },
        { text: "Paid Day", bold: false },
        { text: "Basic", bold: false },
        { text: "DA", bold: false },
        { text: "HRA", bold: false },
        { text: "Conv. All", bold: false },
        { text: "Prod. Incentive", bold: false },
        { text: "Other Earning", bold: false },
        { text: "Wash All", bold: false },
        { text: "Gross Salary", bold: true },
        { text: "PF", bold: false },
        { text: "PTAX", bold: false },
        { text: "ESIC", bold: false },
        { text: "LWF", bold: false },
        { text: "Loan Dedn.", bold: false },
        { text: "Adv. Dedn.", bold: false },
        { text: "Other Dedn.", bold: false },
        { text: "Gross Dedn.", bold: true },
        { text: "Net Sal.", bold: true },
        { text: "Cheque Number", bold: true },
      ],
    ];
    for (let itm of this.salaryDetails) {
      values.push([
        itm.empName,
        itm.employeeId,
        itm.GROSSFIXED,
        itm.paidDays,
        itm.BASIC,
        itm.DA,
        itm.HRA,
        itm.ConvAll,
        itm.ProdIncentive,
        itm.OtherEarning,
        itm.WashAll,
        { text: itm.GROSSEARNING, bold: true },
        itm.PF,
        itm.PTAX,
        itm.ESICEmployee,
        itm.MLWF,
        itm.LoanDeduction,
        itm.AdvDeduction,
        itm.OtherDeduction,
        { text: itm.GROSSDEDUCION, bold: true },
        { text: itm.NETEARNING, bold: true },
        itm.CHEQUE,
      ]);
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      // watermark: {
      //   text: `${this.companyDetails.companyName}`,
      //   color: "blue",
      //   opacity: 0.2,
      //   bold: false,
      //   italics: false,
      // },
      content: [
        {
          text: `Alert Care`,
          style: "header",
          color: "black",
          bold: true,
          alignment: "center",
        },
        {
          text: `Salary Register for the month of ${this.salaryMonth}`,
          color: "black",
          bold: true,
          alignment: "center",
        },
        { text: ` `, alignment: "center" },
        {
          style: "tableExample",
          fontSize: 5,
          table: {
            body: finalValuestoPrint,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 7,
          bold: true,
        },
        subheader: {
          fontSize: 5,
          bold: false,
          margin: [0, 0, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "100%",
        },
      },
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);

    /**
     * download pdf format from the below code
     */
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
    // end
  }
  /**
   * downloadCSVSalaryReport download the CSV format from below Code
   */
  downloadCSVSalaryReport() {
    console.log("downloadCSVSalaryReport clicked===>");
    var data = [];
    for (const itm of this.salaryDetails) {
      data.push({
        empName: itm.empName,
        employeeId: itm.employeeId,
        GROSSFIXED: itm.GROSSFIXED,
        paidDays: itm.paidDays,
        BASIC: itm.BASIC,
        DA: itm.DA,
        HRA: itm.HRA,
        ConvAll: itm.ConvAll,
        ProdIncentive: itm.ProdIncentive,
        OtherEarning: itm.OtherEarning,
        WashAll: itm.WashAll,
        GROSSEARNING: itm.GROSSEARNING,
        PF: itm.PF,
        PTAX: itm.PTAX,
        ESICEmployee: itm.ESICEmployee,
        MLWF: itm.MLWF,
        LoanDeduction: itm.LoanDeduction,
        AdvDeduction: itm.AdvDeduction,
        OtherDeduction: itm.OtherDeduction,
        GROSSDEDUCION: itm.GROSSDEDUCION,
        NETEARNING: itm.NETEARNING,
        CHEQUE: itm.CHEQUE,
      });
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      filename: `${this.salaryMonth}`,
      title: `Salary Report For - ${this.salaryMonth}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }
}
