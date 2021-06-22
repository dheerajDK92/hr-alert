import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";
import { LogSheetServiceService } from "src/app/common/service/log-sheet-service.service";
import { ToastService } from "src/app/common/service/toast.service";
import { UtilService } from "src/app/common/service/util.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-add-task",
  templateUrl: "./add-task.component.html",
  styleUrls: ["./add-task.component.scss"],
})
export class AddTaskComponent implements OnInit, OnChanges {
  @Input("empData") empData: any;
  CmpData: any;
  taskDetails: any = {
    areaOfWork: null,
    generalCleaning: null,
    dampMopping: null,
    washingScrubbing: null,
    litterPicking: null,
  };
  reasonList = [
    { name: "R-As & When Required" },
    { name: "H-Hourly" },
    { name: "D-Daily" },
    { name: "D2-Twice Daily" },
    { name: "F-Fortnightly" },
    { name: "W-Weekly" },
    { name: "M-Monthly" },
    { name: "Y-Yearly" },
  ];
  constructor(
    private modalController: ModalController,
    private file: File,
    private fileOpener: FileOpener,
    private _api: ApiUrlService,
    private plt: Platform,
    private _toast: ToastService,
    private _log: LogSheetServiceService,
    private loader: UtilService,
    private alertController: AlertController
  ) {}
  ngOnChanges(changes: any) {
    if (changes.empData) {
      this.empData = changes.empData.currentValue;
    }
  }

  ngOnInit() {
    this.loader.showLoader();
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this.loadTasks();
  }
  taskList = [];
  loadTasks() {
    this.taskList = [];
    this._log.loadTask(this.CmpData._id).subscribe(
      (res: any) => {
        this.loader.hideLoader();
        console.log("Res===", res);
        if (res.data.taskDetails?.length > 0) {
          this.taskList = res.data.taskDetails;
        }
      },
      (err) => {
        this.loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }

  save() {
    const data = {
      companyId: this.CmpData._id,
      employeeId: this.empData._id,
      areaOfWork: this.taskDetails.areaOfWork,
      generalCleaning: this.taskDetails.generalCleaning,
      DampMoping: this.taskDetails.dampMopping,
      WashingSucrubbing: this.taskDetails.washingScrubbing,
      LitterPicking: this.taskDetails.litterPicking,
    };
    this.loader.showLoader();
    this._log.addTask(data).subscribe(
      (res) => {
        this.loader.hideLoader();
        console.log("Res===", res);
        this.clearFields();
        this.loadTasks();
        this._toast.showWarning("Successfully Added Task");
      },
      (err) => {
        this.loader.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }
  updateTaskSection = false;
  selectedTaskId;
  updateTask(itm) {
    this.updateTaskSection = true;
    this.selectedTaskId = itm._id;
    this.taskDetails = {
      areaOfWork: itm.areaOfWork,
      generalCleaning: itm.generalCleaning,
      dampMopping: itm.DampMoping,
      washingScrubbing: itm.WashingSucrubbing,
      litterPicking: itm.LitterPicking,
    };
  }
  btndisable = false;
  updateTaskRequest() {
    this.btndisable = true;
    this.loader.showLoader();
    const data = {
      companyId: this.CmpData._id,
      employeeId: this.empData._id,
      areaOfWork: this.taskDetails.areaOfWork,
      generalCleaning: this.taskDetails.generalCleaning,
      DampMoping: this.taskDetails.dampMopping,
      WashingSucrubbing: this.taskDetails.washingScrubbing,
      LitterPicking: this.taskDetails.litterPicking,
      _id: this.selectedTaskId,
    };
    this._log.updateTask(data).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.loadTasks();
          this.cancelUpdate();
          this.clearFields();
          this._toast.showWarning(`${data.areaOfWork} Task Is Updated.`);
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
        this.btndisable = false;
      },
      (err) => {
        this.btndisable = false;
        this._toast.showWarning(err.error.error);
      }
    );
  }

  async deleteTask() {
    const confirmAlert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `By Clicking On Confirm, 
      Task Will Be Permanently Delete.`,
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
            const data = {
              _id: this.selectedTaskId,
            };
            this._log.deleteTask(data).subscribe(
              (response: any) => {
                if (isNullOrUndefined(response.error)) {
                  setTimeout(() => {
                    this.clearFields();
                    this.cancelUpdate();
                    this.loadTasks();
                  }, 50);
                  this._toast.showWarning(`Task Is Deleted Successfully.`);
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

  cancelUpdate() {
    this.clearFields();
    this.updateTaskSection = false;
  }

  clearFields() {
    this.taskDetails = {
      areaOfWork: null,
      generalCleaning: null,
      dampMopping: null,
      washingScrubbing: null,
      litterPicking: null,
    };
  }
}
