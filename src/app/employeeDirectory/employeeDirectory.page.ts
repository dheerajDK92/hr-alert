import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  IonInfiniteScroll,
  NavController,
  NavParams,
  ModalController,
  Platform,
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { EmployeeinfoComponent } from "./employee-info/employee-info.component";
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { UtilService } from "../common/service/util.service";
import { GLOBAL } from '../common/commonDeclare';
@Component({
  selector: "app-employee-Directory",
  templateUrl: "./employeeDirectory.page.html",
  styleUrls: ["./employeeDirectory.page.scss"],
})
export class employeeDirectoryPage implements OnInit, OnDestroy {
  public main: string;
  public skelenton = true;
  public empList: any[] = [];
  public filterList: any[] = [];
  public EmpData: any = null;
  public CmpData: any = null;
  public isEmployeeLoading: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private modalController: ModalController,
    private _toast: ToastService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private _util: UtilService
  ) {}
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadCompanyEmp(null);
  }
  loadCompanyEmp(event) {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
    this.isEmployeeLoading = this._emp
      .getCompanyEmployeeDetail(this.EmpData.companyId)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.skelenton = false;
            this.empList = response.data.employeeList;
            this.filterList = response.data.employeeList;
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
          if (event) event.target.complete();
        },
        (err) => {
          this._util.hideLoader();
          this.skelenton = false;
          if (event) event.target.complete();
          this._toast.showWarning(err.error.error);
        }
      );
  }
  async showEmployInfo(employ) {
    const modal = await this.modalController.create({
      component: EmployeeinfoComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: employ,
      },
    });
    return await modal.present();
  }

  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.empList = this.filterList;
    } else {
      this.empList = this.filterList.filter(
        (itm) =>
          String(itm.empname)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.empID)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase()) ||
          String(itm.Site)
            .toLowerCase()
            .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  backButton() {
    this.router.navigate(["/main/Home"]);
  }
  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
  }

  pdfObj = null;
  download() {
    this.createPdf();
  }
  createPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Sr.", bold: true },
        { text: "ID", bold: true },
        { text: "Name", bold: true },
        { text: "Phone", bold: true },
        { text: "Password", bold: true },
        { text: "Site", bold: true },
      ],
    ];
    let count = 1;
    for (let itm of this.empList) {
      const dobEneterd = new Date(itm.DOB);
      const dojEneterd = new Date(itm.DOJ);
      values.push([
        count,
        itm.empID,
        itm.empname,
        itm.phone,
        itm.password,
        itm.Site,
      ]);
      count++;
    }

    const finalValuestoPrint = values;
    /* End here */
    var docDefinition = {
      watermark: {
        text: `${this.CmpData.companyName}`,
        color: "blue",
        opacity: 0.2,
        bold: true,
        italics: false,
      },
      content: [
        {
          image: GLOBAL.logo,
          alignment: "left",
        },
        {
          text: `Employee Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        {
          text: `Total Employee's: ${this.filterList?.length}`,
          alignment: "right",
        },
        { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            body: finalValuestoPrint,
          },
        },
      ],
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
        table: {
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
