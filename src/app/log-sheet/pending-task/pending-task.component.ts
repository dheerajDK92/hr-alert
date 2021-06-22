import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";

@Component({
  selector: "app-pending-task",
  templateUrl: "./pending-task.component.html",
  styleUrls: ["./pending-task.component.scss"],
})
export class PendingTaskComponent implements OnInit, OnChanges {
  @Input("empData") empData: any;
  CmpData: any;
  constructor(
    private modalController: ModalController,
    private file: File,
    private fileOpener: FileOpener,
    private _api: ApiUrlService,
    private plt: Platform
  ) {}
  ngOnChanges(changes: any) {
    if (changes.empData) {
      this.empData = changes.empData.currentValue;
    }
  }

  ngOnInit() {
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
}
