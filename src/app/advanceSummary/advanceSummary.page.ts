import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ModalController, AlertController, Platform } from "@ionic/angular";
import { ToastService } from "../common/service/toast.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { UtilService } from '../common/service/util.service';
@Component({
  selector: "app-advanceSummary",
  templateUrl: "./advanceSummary.page.html",
  styleUrls: ["./advanceSummary.page.scss"],
})
export class advanceSummaryPage implements OnInit {
  public main: string;
  private isAdvanceLoad: Subscription;
  skelenton = true;
  EmpData: any = null;
  CmpData: any = null;
  advanceByEmploy: any[] = [];
  filterList: any[] = [];
  showNoEntryForEmployee: boolean = false;
  expenseDateLimit: String = new Date().toISOString();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private modalController: ModalController,
    private _toast: ToastService,
    private alertController: AlertController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private _util: UtilService
  ) {}
  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadReimbursement();
    setTimeout(() => {
      this.skelenton = false;
    }, 1000);
  }
  loadReimbursement() {
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }

    if (this.EmpData.isHrAdmin == true || this.EmpData.isReportingManager == true) {
      this.isAdvanceLoad = this._emp
        .getRequestAdvanceForAdmin(this.EmpData.companyId)
        .subscribe(
          (response: any) => {
            if (isNullOrUndefined(response.error)) {
              this.advanceByEmploy = response.data.advanceDetails;
              this.filterList = response.data.advanceDetails;
              this.countTotal(response.data.advanceDetails);
              this.createPdf();
            } else {
              this._toast.showWarning("Something Went Wrong. Please try again");
            }
            this._util.hideLoader();
          },
          (err) => {
            this._util.hideLoader();
            this._toast.showWarning(err.error.error);
          }
        );
    } else {
      this.isAdvanceLoad = this._emp
        .getRequestAdvance(this.EmpData._id)
        .subscribe(
          (response: any) => {
            if (isNullOrUndefined(response.error)) {
              this.advanceByEmploy = response.data.advanceDetails;
              this.filterList = response.data.advanceDetails;
              this.countTotal(response.data.advanceDetails);
              this.createPdf();
            } else {
              this._toast.showWarning("Something Went Wrong. Please try again");
            }
            this._util.hideLoader();
          },
          (err) => {
            this._util.hideLoader();
            this._toast.showWarning(err.error.error);
          }
        );
    }
  }
  backButton() {
    this.router.navigate(["/main/Home"]);
  }
  ngOnDestroy() {
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
  }

  async performRejectAction(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by ${selectedItem.email} will Reject. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                phone: selectedItem.phone,
                advanceType: selectedItem.advanceType,
                remarks: selectedItem.remarks,
                status: "Rejected",
                _id: selectedItem._id,
              };
              this._emp.updateAdvanceStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Advance Request Is Rejected.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  async performApproveAction(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by ${selectedItem.email} will Approve. If you want to proceed please click on Confirm.`,
      inputs: [
        {
          type: "textarea",
          name: "Remarks",
          placeholder: "Remarks...",
        },
      ],
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
          handler: (res) => {
            if (
              res.Remarks === "" ||
              res.Remarks === null ||
              res.Remarks === undefined
            ) {
              this._toast.showWarning("Remarks are mandatory");
              return false;
            } else {
              const finalData: any = {
                amount: selectedItem.amount,
                companyId: selectedItem.companyId,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Approved",
                _id: selectedItem._id,
              };
              this._emp.updateAdvanceStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Advance Request Is Approved.`
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
            }
          },
        },
      ],
      // backdropDismiss: false,
    });

    await confirmAlert.present();
  }

  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.advanceByEmploy = this.filterList;
    } else {
      this.advanceByEmploy = this.filterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }
  totalApproved = [];
  totalInProgress = [];
  totalRejected = [];
  countTotal(total) {
    this.totalApproved = total.filter((data) => {
      return data.status == "Approved";
    });
    this.totalInProgress = total.filter((data) => {
      return data.status == "inProgress";
    });
    this.totalRejected = total.filter((data) => {
      return data.status == "Rejected";
    });
  }

  pdfObj = null;
  createPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Advance Type", bold: true },
        { text: "Amount", bold: true },
        { text: "Date", bold: true },
        { text: "Email", bold: true },
        { text: "Emp Remark", bold: true },
        { text: "HR Remarks", bold: true },
        { text: "Status", bold: true },
      ],
    ];
    for (let itm of this.filterList) {
      const dateEntered = new Date(itm.date);
      values.push([
        itm.advanceType,
        itm.amount,
        `${dateEntered.getDate()}:${dateEntered.getMonth()}:${dateEntered.getFullYear()}`,
        itm.email,
        itm.remarks,
        itm.hrRemarks,
        itm.status,
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
          text: `Advance Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        { text: `Total ${this.filterList?.length}`, alignment: "right" },
        { text: new Date().toTimeString(), alignment: "right" },
        { text: ``, alignment: "center" },
        {
          style: "tableExample",
          table: {
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
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
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
