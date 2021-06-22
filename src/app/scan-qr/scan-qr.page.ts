import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { isNullOrUndefined } from "util";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { environment } from "src/environments/environment";
import { UtilService } from "../common/service/util.service";

@Component({
  selector: "app-scan-qr",
  templateUrl: "./scan-qr.page.html",
  styleUrls: ["./scan-qr.page.scss"],
})
export class ScanQrPage implements OnInit {
  /**
   * Initialize variable
   */
  main: String;
  scannedEmployeeID: any;
  scannedEmployeeData: any;
  punchDate: any;
  msg: any = "";
  address: any = "";
  currentLatitude: any;
  currentLongiitude: any;
  stopPunchData: any;
  /**
   *
   * @param router Router
   * @param activatedRoute Activated Router state
   * @param barcodeScanner Barcode Injector
   * @param _emp Employee Service
   * @param _toast Toast Service
   * @param geolocation Geolocation APi
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private geolocation: Geolocation,
    private _util: UtilService
  ) {}
  /**
   * oninit hooks
   */
  ngOnInit() {
    this._util.showLoader();
    const dateNow = new Date();
    this.punchDate = `${
      dateNow.getMonth() + 1
    }/${dateNow.getHours()}/${dateNow.getFullYear()}`;
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this.getUserPosition();
  }

  /**
   * Get User Current Position
   */
  getUserPosition() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.currentLatitude = resp.coords.latitude;
        this.currentLongiitude = resp.coords.longitude;
        this._emp
          .getAddress(
            `${environment.geoCodingRever}&lat=${this.currentLatitude}&lon=${this.currentLongiitude}`
          )
          .subscribe(
            (res: any) => {
              this.address = res.display_name;
              this._util.hideLoader();
              // this.scannedEmployeeID = "5f43c6926caaa04a1caa61a0"; // TODo: Need to delete
              // this.loadScannedEmployee(); // TODo: Need to delete
            },
            (err) => {
              this._util.hideLoader();
              console.log(err);
            }
          );
      })
      .catch((error) => {
        this._util.hideLoader();
        console.log("Error getting location", error);
      });
  }
  /**
   * back to home
   */
  backButton() {
    this.router.navigate(["/main/Home"]);
  }
  /**
   * scan barcode
   */
  scanBarcode() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.scannedEmployeeID = barcodeData.text;
        this.loadScannedEmployee();
        // alert(JSON.stringify(barcodeData));
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }
  /**
   * Load scanned employee details
   */
  loadScannedEmployee() {
    this._emp.getEmployeeDetail(this.scannedEmployeeID).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.scannedEmployeeData = response.data;
          if (this.scannedEmployeeData) {
            this.validatePunchStatus();
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
   * Validate Punch Status
   */
  validatePunchStatus() {
    this._emp
      .getEmployeePunch({
        punchDate: this.punchDate,
        employeeId: this.scannedEmployeeData.employeeData[0]._id,
      })
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            this.stopPunchData = response.data.details;
            if (this.stopPunchData.length > 0) {
              if (
                this.stopPunchData[0].startTime != "" &&
                this.stopPunchData[0].stopTime == ""
              ) {
                this.stopPunch();
              } else {
                this.startPunch();
              }
            } else {
              this.startPunch();
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
   * Start Punch After Barcode Scan
   */
  startPunch() {
    this._util.showLoader();
    const dateNow = new Date();
    const startTime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    const finalData = {
      companyId: this.scannedEmployeeData.employeeData[0].companyId,
      employeeId: this.scannedEmployeeData.employeeData[0]._id,
      punchDate: this.punchDate,
      startTime: startTime,
      stopTime: "",
      latitude: this.currentLatitude,
      longitude: this.currentLongiitude,
      address: this.address,
      clockInImage: "",
      clockOutImage: "",
    };
    this._emp.savePunchInTime(finalData).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          this.msg = `Successfully Punch In for ${this.scannedEmployeeData.employeeData[0].empname} at ${startTime}`;
          this._toast.showWarning(this.msg);
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
  /**
   * Stop Punch - Start
   */
  stopPunch() {
    this._util.showLoader();
    const dateNow = new Date();
    const stopTime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    const finalData = {
      companyId: this.stopPunchData[0].companyId,
      employeeId: this.stopPunchData[0].employeeId,
      punchDate: this.stopPunchData[0].punchDate,
      startTime: this.stopPunchData[0].startTime,
      stopTime: stopTime,
      latitude: this.currentLatitude,
      longitude: this.currentLongiitude,
      address: this.address,
      clockInImage: "",
      clockOutImage: "",
      _id: this.stopPunchData[0]._id,
    };
    this._emp.savePunchOutTime(finalData).subscribe(
      (response: any) => {
        if (isNullOrUndefined(response.error)) {
          console.log("punch  In response", response);
          this.msg = `Successfully Punch Out for ${this.scannedEmployeeData.employeeData[0].empname} at ${stopTime}`;
          this._toast.showWarning(this.msg);
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
