import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ModalController, AlertController, Platform } from "@ionic/angular";
import { ApiUrlService } from "../common/service/api-url.service";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { UtilService } from '../common/service/util.service';
@Component({
  selector: "app-employee-LeaveSummary",
  templateUrl: "./employeeLeaveSummary.page.html",
  styleUrls: ["./employeeLeaveSummary.page.scss"],
})
export class employeeLeaveSummaryPage implements OnInit, OnDestroy {
  public main: string;
  private isLeaveLoad: Subscription;
  skelenton = true;
  EmpData: any = null;
  CmpData:any = null;
  leaveByEmploy: any[] = [];
  filterList: any[] = [];
  totalApproved = [];
  totalInProgress = [];
  totalRejected = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _api: ApiUrlService,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private alertController: AlertController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private _util: UtilService
  ) {}
  /**
   * ngOnInit: inbuilt lifecycle hook of component
   */
  ngOnInit() {
    this._util.showLoader();
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadApplyLeave();
    setTimeout(() => {
      this.skelenton = false;
    }, 1000);
  }

  /**
   * loadApplyLeave : Load the Leave details
   */
  loadApplyLeave() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
    if (this.EmpData.isHrAdmin == true || this.EmpData.isReportingManager == true) {
      this.isLeaveLoad = this._emp
        .getRequestLeaveForAdmin(this.EmpData.companyId)
        .subscribe(
          (response: any) => {
            this._util.hideLoader();
            if (isNullOrUndefined(response.error)) {
              this.leaveByEmploy = response.data.details;
              this.filterList = response.data.details;
              this.countTotal(response.data.details);
              this.createPdf();
            } else {
              this._toast.showWarning("Something Went Wrong. Please try again");
            }
          },
          (err) => {
            this._util.hideLoader();
            this._toast.showWarning(err.error.error);
          }
        );
    } else {
      this.isLeaveLoad = this._emp.getRequestLeave(this.EmpData._id).subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.leaveByEmploy = response.data.details;
            this.filterList = response.data.details;
            this.countTotal(response.data.details);
            this.createPdf();
          } else {
            this._toast.showWarning("Something Went Wrong. Please try again");
          }
        },
        (err) => {
          this._util.hideLoader();
          this._toast.showWarning(err.error.error);
        }
      );
    }
  }

  /**
   *
   * @param event after change search value event will have ref of updated value
   */
  searchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.leaveByEmploy = this.filterList;
    } else {
      this.leaveByEmploy = this.filterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  /**
   *
   * @param total containes result of leaves and will filter bases upon status
   */
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

  async performRejectAction(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Leave request by ${selectedItem.email} will Reject. If you want to proceed please click on Confirm.`,
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
                startDate: selectedItem.startDate,
                endDate: selectedItem.endDate,
                allDay: selectedItem.allDay,
                reason: selectedItem.reason,
                companyId: selectedItem.companyId,
                employeeId: selectedItem.employeeId,
                email: selectedItem.email,
                phone: selectedItem.phone,
                status: "Rejected",
                hrRemarks: res.Remarks,
                _id: selectedItem._id,
              };
              this._emp.updateLeaveStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadApplyLeave();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Leave Request Is Rejected.`
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
      Leave request by ${selectedItem.email} will Approve. If you want to proceed please click on Confirm.`,
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
                startDate: selectedItem.startDate,
                endDate: selectedItem.endDate,
                allDay: selectedItem.allDay,
                reason: selectedItem.reason,
                companyId: selectedItem.companyId,
                employeeId: selectedItem.employeeId,
                email: selectedItem.email,
                phone: selectedItem.phone,
                status: "Approved",
                hrRemarks: res.Remarks,
                _id: selectedItem._id,
              };
              this._emp.updateLeaveStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadApplyLeave();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Leave Request Is Approved.`
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

  /**
   * Back to home page
   */
  backButton() {
    this.router.navigate(["/main/Home"]);
  }

  /**
   * unsubscribe the request if user will switch to other component
   */
  ngOnDestroy() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
  }

   pdfObj = null;
  createPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Email", bold: true },
        { text: "Leave Reason", bold: true },
        { text: "Start Date", bold: true },
        { text: "End Date", bold: true },
        { text: "HR Remarks", bold: true },
        { text: "Status", bold: true },
      ],
    ];
    for (let itm of this.filterList) {
      const startDate = new Date(itm.startDate);
      const endDate = new Date(itm.endDate);
      values.push([
        itm.email,
        itm.reason,
        `${startDate.getDate()}:${startDate.getMonth()}:${startDate.getFullYear()}`,
        `${endDate.getDate()}:${endDate.getMonth()}:${endDate.getFullYear()}`,
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
          text: `Leave Detail's`,
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
