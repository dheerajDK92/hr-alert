import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  IonInfiniteScroll,
  NavController,
  NavParams,
  ModalController,
  Platform
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { EmployeeinfoComponent } from "../employeeDirectory/employee-info/employee-info.component";
import { isNullOrUndefined } from "util";
import { ToastService } from "../common/service/toast.service";
import { EmployeeService } from "../common/service/employee.service";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeAddComponent } from "./employee-add/employee-add.component";
import { EmployeeUpdateComponent } from "./employee-update/employee-update.component";
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { UtilService } from '../common/service/util.service';
@Component({
  selector: "app-employee",
  templateUrl: "./employee.page.html",
  styleUrls: ["./employee.page.scss"],
})
export class employeePage implements OnInit, OnDestroy {
  public main: string;
  skelenton = true;
  empList: any[] = [];
  filterList: any[] = [];
  EmpData: any = null;
  CmpData: any = null;
  public isEmployeeLoading: Subscription;
  showNoEntryForEmployee: boolean = false;
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
  @ViewChild("content") content: any;

  ngOnInit() {
    this._util.showLoader();
    this.skelenton = true;
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
            this.empList = response.data.employeeList;
            this.filterList = response.data.employeeList;
            this.createPdf();
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
          this.skelenton = false;
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
  async showEmployInfo(selectedEmploy) {
    const modal = await this.modalController.create({
      component: EmployeeUpdateComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: selectedEmploy,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  async addEmployee() {
    const modal = await this.modalController.create({
      component: EmployeeAddComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });

    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });

    return await modal.present();
  }

  backButton() {
    this.router.navigate(["/main/Home"]);
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

  ngOnDestroy() {
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }
  }
  pdfObj = null;
  createPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "ID", bold: true },
        { text: "Name", bold: true },
        { text: "Email", bold: true },
        { text: "Designation", bold: true },
        { text: "Gender", bold: true },
        { text: "DOB", bold: true },
        { text: "DOJ", bold: true },
      ],
    ];
    for (let itm of this.filterList) {
      const dobEneterd = new Date(itm.DOB);
      const dojEneterd = new Date(itm.DOJ);
      values.push([
        itm.empID,
        itm.empname,
        itm.email,
        itm.designation,
        itm.gender,
        `${dobEneterd.getDate()}:${dobEneterd.getMonth()}:${dobEneterd.getFullYear()}`,
        `${dojEneterd.getDate()}:${dojEneterd.getMonth()}:${dojEneterd.getFullYear()}`,
        // { text: `${itm.address},${itm.city}(${itm.pincode}),${itm.state},${itm.country}`, width:'12%', bold: true },
      ]);
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
