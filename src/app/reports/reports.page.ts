import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";
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
import { UtilService } from "../common/service/util.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.page.html",
  styleUrls: ["./reports.page.scss"],
})
export class reportsPage implements OnInit, OnDestroy {
  public main: string;
  EmpData: any = null;
  CmpData: any = null;
  isEmployeeLoading: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private plt: Platform,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private file: File,
    private fileOpener: FileOpener,
    private alertController: AlertController,
    private _util: UtilService
  ) {}

  ngOnInit() {
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
      this.selectedEmployee = this.EmpData;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadCompanyEmp();
  }
  /**
   * load company employee details
   */
  employees: any[] = [];
  selectedEmployee: any;
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
          } else {
            this._toast.showWarning(
              "Something Went Wrong While Loading Employee. Please try again"
            );
          }
        },
        (err) => {
          this._toast.showWarning(err.error.error);
        }
      );
  }
  /**
   * Search
   */
  reportType: any;
  selectedScreen: any;
  search() {
    this.EmpData = this.selectedEmployee;
    if (this.reportType == "Leave Summary") {
      this.selectedScreen = "Leave";
      this._util.showLoader();
      this.loadApplyLeave();
    } else if (this.reportType == "Advance Summary") {
      this.selectedScreen = "Advance";
      this._util.showLoader();
      this.loadAdvance();
    } else if (this.reportType == "Reimbursement Summary") {
      this.selectedScreen = "Reimbursement";
      this._util.showLoader();
      this.loadReimbursement();
    } else if (this.reportType == "Attendance Summary") {
      this.selectedScreen = "Attendance";
      this._util.showLoader();
      this.loadAttendance();
    } else {
      this._toast.showWarning("Please Select Report Type To Proceed.");
    }
  }

  /**
   * loadApplyLeave : Load the Leave details - start
   */
  private isLeaveLoad: Subscription;
  leaveByEmploy: any;
  leaveFilterList: any;
  loadApplyLeave() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
    this.isLeaveLoad = this._emp.getRequestLeave(this.EmpData._id).subscribe(
      (response: any) => {
        this._util.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this.leaveByEmploy = response.data.details;
          this.leaveFilterList = response.data.details;
          this.createLeavePdf();
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

  pdfObj = null;
  createLeavePdf() {
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
    for (let itm of this.leaveFilterList) {
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
        { text: `Total ${this.leaveFilterList?.length}`, alignment: "right" },
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

  /**
   *
   * @param event after change search value event will have ref of updated value
   */
  leaveSearchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.leaveByEmploy = this.leaveFilterList;
    } else {
      this.leaveByEmploy = this.leaveFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionLeave(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Leave request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
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

  async performApproveActionLeave(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Leave request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
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
   * end leave
   */

  /**
   * Reimbursement Start
   */
  isReimburseLoad: Subscription;
  reimbursementByEmploy: any;
  reimbursementFilterList: any;
  loadReimbursement() {
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
    this.isReimburseLoad = this._emp
      .getRequestReimbursement(this.EmpData._id)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.reimbursementByEmploy = response.data.reimbursementDetails;
            this.reimbursementFilterList = response.data.reimbursementDetails;
            // this.countTotal(response.data.reimbursementDetails);
            this.createReimbursementPdf();
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

  createReimbursementPdf() {
    /**
     * creating the pdf data - start
     */
    let values = [
      [
        { text: "Type", bold: true },
        { text: "Amount", bold: true },
        { text: "Date", bold: true },
        { text: "Email", bold: true },
        { text: "Status", bold: true },
      ],
    ];
    for (let itm of this.reimbursementFilterList) {
      const dateEntered = new Date(itm.date);
      values.push([
        itm.reimbursementType,
        itm.amount,
        `${dateEntered.getDate()}:${dateEntered.getMonth()}:${dateEntered.getFullYear()}`,
        itm.email,
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
          text: `Reimbursement Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        {
          text: `Total ${this.reimbursementFilterList?.length}`,
          alignment: "right",
        },
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

  reimbursementSearchBarChange(event: any) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.reimbursementByEmploy = this.reimbursementFilterList;
    } else {
      this.reimbursementByEmploy = this.reimbursementFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionReimbursement(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Reimbursement request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
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
                destination: selectedItem.destination,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                origin: selectedItem.origin,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Rejected",
                _id: selectedItem._id,
              };
              this._emp.updateReimbursementStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Reimbursement Request Is Rejected.`
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

  async performApproveActionReimbursement(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Reimbursement request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
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
                destination: selectedItem.destination,
                email: selectedItem.email,
                employeeId: selectedItem.employeeId,
                expenseDate: selectedItem.expenseDate,
                hrRemarks: res.Remarks,
                origin: selectedItem.origin,
                phone: selectedItem.phone,
                reimbursementType: selectedItem.reimbursementType,
                remarks: selectedItem.remarks,
                status: "Approved",
                _id: selectedItem._id,
              };
              this._emp.updateReimbursementStatus(finalData).subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.loadReimbursement();
                    this._toast.showWarning(
                      `${selectedItem.email}'s Reimbursement Request Is Approved.`
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
   * Reimbursement End
   */

  /**
   * Advance Start
   */
  isAdvanceLoad: Subscription;
  advanceByEmploy: any;
  advanceFilterList: any;
  loadAdvance() {
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
    this.isAdvanceLoad = this._emp
      .getRequestAdvance(this.EmpData._id)
      .subscribe(
        (response: any) => {
          this._util.hideLoader();
          if (isNullOrUndefined(response.error)) {
            this.advanceByEmploy = response.data.advanceDetails;
            this.advanceFilterList = response.data.advanceDetails;
            // this.countTotal(response.data.advanceDetails);
            this.createAdvancePdf();
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

  createAdvancePdf() {}

  advanceSearchBarChange(event) {
    const searchValue = event.detail.value;
    if (searchValue == "" || searchValue == null || searchValue == undefined) {
      this.advanceByEmploy = this.advanceFilterList;
    } else {
      this.advanceByEmploy = this.advanceFilterList.filter((itm) =>
        String(itm.email)
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase())
      );
    }
  }

  async performRejectActionAdvance(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by <strong>${selectedItem.email}</strong> will <strong>Reject</strong>. If you want to proceed please click on Confirm.`,
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
                    this.loadAdvance();
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

  async performApproveActionAdvance(selectedItem) {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By clicking on confirm, 
      Advance request by <strong>${selectedItem.email}</strong> will <strong>Approve</strong>. If you want to proceed please click on Confirm.`,
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
                    this.loadAdvance();
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

  /**
   * Advance End
   */

  /**
   * Attendance Start
   */
  attendanceList: any[] = [];
  isAttendanceLoading: Subscription;
  loadAttendance() {
    if (this.isAttendanceLoading) {
      this.isAttendanceLoading.unsubscribe();
    }
    const data = {
      employeeId: this.EmpData._id,
      companyId: this.EmpData.companyId,
      startFrom: "",
      endTo: "",
    };
    this.isAttendanceLoading = this._emp.empFetchPunch(data).subscribe(
      (response: any) => {
        this._util.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this.attendanceList = response.data.details;
          // this.attendanceFilterList = response.data.advanceDetails;
          // this.createAdvancePdf();
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
   * Attendance end
   */

  ngOnDestroy() {
    if (this.isLeaveLoad) {
      this.isLeaveLoad.unsubscribe();
    }
    if (this.isReimburseLoad) {
      this.isReimburseLoad.unsubscribe();
    }
    if (this.isAdvanceLoad) {
      this.isAdvanceLoad.unsubscribe();
    }
    if (this.isAttendanceLoading) {
      this.isAttendanceLoading.unsubscribe();
    }
    if (this.isEmployeeLoading) {
      this.isEmployeeLoading.unsubscribe();
    }

    this.EmpData = null;
    this.CmpData = null;
  }
}
