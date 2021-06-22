import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ApiUrlService } from "src/app/common/service/api-url.service";

@Component({
  selector: "app-employee-info",
  templateUrl: "./employee-info.component.html",
  styleUrls: ["./employee-info.component.scss"],
})
export class EmployeeinfoComponent implements OnInit, OnChanges {
  @Input("empData") empData: any;
  title = "app";
  elementType = "url";
  value = "Swati Tech";
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
      this.value = this.empData._id;
    }
  }

  ngOnInit() {
    this.value = this.empData._id;
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
  }

  cancelPopUp() {
    this.modalController.dismiss();
  }
  download() {
    this.createLeavePdf();
  }
  /**
   * create pdf
   */
  pdfObj = null;
  createLeavePdf() {
    /**
     * creating the pdf data - start
     */

    /* End here */
    var docDefinition = {
      content: [
        {
          text: `${this.empData.empname} Detail's`,
          style: "header",
          color: "blue",
          bold: true,
        },
        { text: `Employee Detail`, alignment: "right" },
        { text: new Date().toTimeString(), alignment: "right" },
        " ",
        " ",
        {
          columns: [
            { qr: this.empData._id, alignment: "center" },
            {
              stack: [
                `Emp ID: ${this.empData.empID}`,
                `Site: ${this.empData.Site}`,
                `Designation: ${this.empData.designation}`,
                `Company: ${this.CmpData.companyName}`,
                `Email: ${this.empData.email}`,
                `Phone: ${this.empData.phone}`,
                `Country: ${this.empData.country}`,
              ],
              fontSize: 15,
            },
          ],
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
}
