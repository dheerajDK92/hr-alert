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
import { GLOBAL } from "../common/commonDeclare";

@Component({
  selector: "app-salary-slip",
  templateUrl: "./salary-slip.page.html",
  styleUrls: ["./salary-slip.page.scss"],
})
export class SalarySlipPage implements OnInit, OnDestroy {
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
  slips: any[] = [];
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
    this.loadSalarySlips();
  }
  /**
   * load Salary Slips
   */
  loadSalarySlips() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    console.log("this.EmpData", this.EmpData)
    this.isEmployeeLoading = this._emp
      .getSalarySlips(this.EmpData.empID)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.slips = response.data.salarySlips;
            console.log("this.slips", this.slips);
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
  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.EmpData = null;
    this.CmpData = null;
    this.slips = [];
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
  downloadPaySlip(item) {
    console.log("item", item);

    /**
     * creating the pdf data - start
     */
    const finalPage = [
      {
        image: GLOBAL.logo,
        alignment: "left",
      },
      {
        text: `PAY SLIP - ${item.month}`,
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
          widths: ["*", 100, 100, "*"],
          body: [
            ["", "", ``, ""], // `${this.CmpData.companyName}
            ["EMP NAME", `${item.empName}`, "EMP ID", `${item.employeeId}`],
            ["Paid Days", `${item.paidDays}`, "SITE", `${item.SITE}`],
            [
              { text: "EARNING", bold: true },
              "",
              { text: "DEDUCTION", bold: true },
              "",
            ],
            [
              { text: "BASIC" },
              `${item.BASIC}`,
              { text: "PF" },
              `${item.PF}`,
            ],
            [
              { text: "DA" },
              `${item.DA}`,
              { text: "ESICEmployee" },
              `${item.ESICEmployee}`,
            ],
            [
              { text: "SpecialAllowance" },
              `${item.SpecialAllowance}`,
              { text: "PT" },
              `${item.PTAX}`,
            ],
            [{ text: "OtherAllowance" }, `${item.OtherAllowance}`, ``, ``],
            [{ text: "" }, ``, { text: "MLWF" }, `${item.MLWF}`],
            [
              { text: "" },
              ``,
              { text: "OtherDeduction" },
              `${item.OtherDeduction}`,
            ],
            [
              { text: "GROSS EARNING", bold: true },
              { text: `${item.GROSSEARNING}`, bold: true },
              { text: "GROSS DEDUCTION", bold: true },
              { text: `${item.GROSSDEDUCION}`, bold: true },
            ],
            [
              { text: "NET EARNING", bold: true },
              { text: `${item.NETEARNING}`, bold: true },
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
          fontSize: 14,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "100%",
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
}
