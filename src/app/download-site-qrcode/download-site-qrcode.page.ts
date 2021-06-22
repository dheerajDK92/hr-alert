import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
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

@Component({
  selector: "app-download-site-qrcode",
  templateUrl: "./download-site-qrcode.page.html",
  styleUrls: ["./download-site-qrcode.page.scss"],
})
export class DownloadSiteQRCodePage implements OnInit {
  main: String;
  isEmployeeLoading: Subscription;
  EmpData: any;
  CmpData: any;
  siteSelected: any;
  sites = [];
  employees = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _emp: EmployeeService,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {}
  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
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
          if (isNullOrUndefined(response.error)) {
            this.employees = response.data.employeeList;
            const uniqueSite = [
              ...new Set(response.data.employeeList.map((obj) => obj.Site)),
            ];
            if(this.EmpData.isReportingManager && !this.EmpData.isHrAdmin){
              for(let itm of uniqueSite){
                if(String(itm).trim() == String(this.EmpData.Site).trim()){
                  this.sites = Array(itm);
                }
              }
            }else{
              this.sites = uniqueSite;
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
   * Null check
   */
  isNull(val) {
    return val == "" || val == null || val == undefined;
  }
  /**
   *
   */
  downloadSiteBarcode() {
    if (this.isNull(this.siteSelected)) {
      this._toast.showWarning("Please Select Site To Proceed.");
    } else {
      const employeesForSite = this.employees.filter(
        (itm) => itm.Site == this.siteSelected
      );
      this.createLeavePdf(employeesForSite);
    }
  }
  /**
   * create pdf
   */
  pdfObj = null;
  createLeavePdf(employeesForSite) {
    /**
     * creating the pdf data - start
     */
    const finalPage = [];
    /**
     * looping the filtered employee site vise - start
     */
    for (let itm of employeesForSite) {
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push({
        text: `${itm.empname} Detail's`,
        style: "header",
        color: "blue",
        bold: true,
      });
      finalPage.push({ text: `Employee Detail`, alignment: "right" });
      finalPage.push({ text: new Date().toTimeString(), alignment: "right" });
      finalPage.push(" ");
      finalPage.push(" ");
      finalPage.push({
        columns: [
          { qr: itm._id, alignment: "center" },
          {
            stack: [
              `Emp ID: ${itm.empID}`,
              `Site: ${itm.Site}`,
              `Designation: ${itm.designation}`,
              `Company: ${this.CmpData.companyName}`,
              `Email: ${itm.email}`,
              `Phone: ${itm.phone}`,
              `Country: ${itm.country}`,
            ],
            fontSize: 15,
          },
        ],
      });
    }
    /**
     * looping the filtered employee site vise - end
     */
    var docDefinition = {
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
   * back to home page
   */
  backButton() {
    this.router.navigate(["/main/Home"]);
  }
}
