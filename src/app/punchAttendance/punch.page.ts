import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../common/service/authentication.service";
import { ApiUrlService } from "../common/service/api-url.service";
import { DomSanitizer } from "@angular/platform-browser";
import { EmployeeService } from "../common/service/employee.service";
import { ToastService } from "../common/service/toast.service";
import { Platform, AlertController } from "@ionic/angular";
import { CameraPreview } from "@ionic-native/camera-preview/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { isNullOrUndefined } from "util";
import { Subscription } from "rxjs";
import { UtilService } from "../common/service/util.service";
import { environment } from "src/environments/environment";
import { throws } from "assert";

// import {
//   VideoCapturePlus, VideoCapturePlusOptions,
// } from "@ionic-native/video-capture-plus/ngx";

declare var google;

@Component({
  selector: "app-punch",
  templateUrl: "./punch.page.html",
  styleUrls: ["./punch.page.scss"],
})
export class punchPage implements OnInit, OnDestroy {
  public main: string;
  public EmpData: any = null;
  public CmpData: any = null;
  public startBreakTime: any;
  public stopBreakTime: any;
  public currentLatitude: any;
  public currentLongiitude: any;
  public photos: any[];
  showBreakSection: boolean = false;
  private inTimeLoading: Subscription;
  private outTimeLoading: Subscription;
  isStartPunch = true;
  imagePath: any;
  attendanceList: any[] = [];
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  punchDate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private _api: ApiUrlService,
    private geolocation: Geolocation,
    private _emp: EmployeeService,
    private _toast: ToastService,
    private platform: Platform,
    private alertController: AlertController,
    // private videoCapturePlus: VideoCapturePlus,
    private cameraPreview: CameraPreview,
    private _util: UtilService
  ) {}

  ngOnInit() {
    this._util.showLoader();
    const dateNow = new Date();
    this.punchDate = `${
      dateNow.getMonth() + 1
    }/${dateNow.getDate()}/${dateNow.getFullYear()}`;
    this.main = this.activatedRoute.snapshot.paramMap.get("id");

    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });

    this.getUserPosition();
    this.validatePunchIfExist();
  }
  inTimeEnteredData: any = null;
  disableInTime: any = false;
  disableOutTime: any = false;
  stopPunchData: any;
  validatePunchIfExist() {
    this._emp
      .getEmployeePunch({
        punchDate: this.punchDate,
        employeeId: this.EmpData._id,
      })
      .subscribe(
        (response: any) => {
          if (isNullOrUndefined(response.error)) {
            // console.log("punch response", response);
            this.stopPunchData = response.data.details;
            this.attendanceList = response.data.details;
            if (this.stopPunchData.length > 0) {
              if (
                this.stopPunchData[0].startTime != "" &&
                this.stopPunchData[0].stopTime == ""
              ) {
                this.isStartPunch = false;
              } else {
                this.isStartPunch = true;
              }
            } else {
              this.isStartPunch = true;
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
  address: any = "";
  getUserPosition() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        try {
          this.currentLatitude = resp.coords.latitude;
          this.currentLongiitude = resp.coords.longitude;
          // throw new Error('Something bad happened');
          this._emp
            .getAddress(
              `${environment.geoCodingRever}&lat=${this.currentLatitude}&lon=${this.currentLongiitude}`
            )
            .subscribe(
              (res: any) => {
                this._util.hideLoader();
                if (res["display_name"]) {
                  this.address = res.display_name;
                } else {
                  this.address = "";
                }
              },
              (err) => {
                this._util.hideLoader();
                this.address = "";
                console.log(err);
              }
            );
        } catch (e) {
          this._util.hideLoader();
          this.address = "";
        }
      })
      .catch((error) => {
        this._util.hideLoader();
        this.address = "";
        console.log("Error getting location", error);
      });
  }
  // addMap(lat, long) {
  //   let latLng = new google.maps.LatLng(lat, long);

  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   };

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   this.addMarker();
  // }

  // addMarker() {
  //   let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: this.map.getCenter(),
  //   });

  //   let content = "<p>This is your current position !</p>";
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content,
  //   });
  //   infoWindow.open(this.map, marker);
  //   // google.maps.event.addListener(marker, "click", () => {
  //   //   infoWindow.open(this.map, marker);
  //   // });
  // }

  /**
   * Back to Home
   */
  backButton() {
    this.router.navigate(["/main/Home"]);
  }

  isLocationNull(val) {
    return val === "" || val === undefined || val === null;
  }

  /**
   * Punch In Start
   */
  async inClicked() {
    const date = new Date();
    const inTime =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if (this.isLocationNull(this.address)) {
      this.address = "Location was not given while Punching.";
    }
    const finalData = {
      companyId: this.EmpData.companyId,
      employeeId: this.EmpData._id,
      punchDate: this.punchDate,
      startTime: inTime,
      stopTime: "",
      latitude: this.currentLatitude,
      longitude: this.currentLongiitude,
      address: this.address,
      clockInImage: "",
      clockOutImage: "",
    };

    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `Do you want to start your punch for ${this.punchDate} at ${inTime}`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            if (this.inTimeLoading) {
              this.inTimeLoading.unsubscribe();
            }
            this.inTimeLoading = this._emp.savePunchInTime(finalData).subscribe(
              (response: any) => {
                if (isNullOrUndefined(response.error)) {
                  this.ngOnInit();
                  this._toast.showWarning(
                    `Your Have successfully punch in for ${this.punchDate} at ${inTime}.`
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
          },
        },
      ],
    });

    await alert.present();
  }
  /**
   * Punch Out
   */
  async outClicked() {
    const date = new Date();
    // const punchDate = date.toLocaleDateString();
    const outTime =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if (this.isLocationNull(this.address)) {
      this.address = "Location was not given while Punching.";
    }
    const finalData = {
      companyId: this.stopPunchData[0].companyId,
      employeeId: this.stopPunchData[0].employeeId,
      punchDate: this.punchDate,
      startTime: this.stopPunchData[0].startTime,
      stopTime: outTime,
      latitude: this.currentLatitude,
      longitude: this.currentLongiitude,
      address: this.address,
      clockInImage: "",
      clockOutImage: "",
      _id: this.stopPunchData[0]._id,
    };
    console.log("finalData ===>", finalData);
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Do you want to proceed?",
      message: `Do you want to stop your punch for ${this.punchDate} at ${outTime}`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            if (this.outTimeLoading) {
              this.outTimeLoading.unsubscribe();
            }
            this.outTimeLoading = this._emp
              .savePunchOutTime(finalData)
              .subscribe(
                (response: any) => {
                  if (isNullOrUndefined(response.error)) {
                    this.ngOnInit();
                    this._toast.showWarning(
                      `Your Have successfully Punch out for ${this.punchDate} at ${outTime}.`
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
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this.inTimeLoading) {
      this.inTimeLoading.unsubscribe();
    }
    if (this.outTimeLoading) {
      this.outTimeLoading.unsubscribe();
    }
  }

  // takePicture() {
  //   const options: VideoCapturePlusOptions = {
  //     limit: 1,
  //     highquality: true,
  //   };

  //   this.videoCapturePlus
  //     .captureVideo(options)
  //     .then((mediaFile) => {
  //       console.log(mediaFile);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  /****
   * \
   */
  smallPreview: boolean;
  IMAGE_PATH: any;
  colorEffect = "none";
  setZoom = 1;
  flashMode = "off";
  isToBack = false;

  startCameraAbove() {
    this.cameraPreview.stopCamera().then(() => {
      this.isToBack = false;
      this.cameraPreview.startCamera({
        x: 80,
        y: 450,
        width: 250,
        height: 300,
        toBack: false,
        previewDrag: true,
        tapPhoto: true,
      });
    });
  }

  startCameraBelow() {
    this.cameraPreview.stopCamera().then(() => {
      this.isToBack = true;
      this.cameraPreview.startCamera({
        x: 0,
        y: 50,
        width: window.screen.width,
        height: window.screen.height,
        camera: "front",
        tapPhoto: true,
        previewDrag: false,
        toBack: true,
      });
    });
  }

  stopCamera() {
    this.cameraPreview.stopCamera();
  }

  takePicture() {
    this.cameraPreview
      .takePicture({
        width: 1280,
        height: 1280,
        quality: 85,
      })
      .then(
        (imageData) => {
          this.IMAGE_PATH = "data:image/jpeg;base64," + imageData;
        },
        (err) => {
          console.log(err);
          this.IMAGE_PATH = "assets/img/test.jpg";
        }
      );
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  show() {
    this.cameraPreview.show();
  }

  hide() {
    this.cameraPreview.hide();
  }

  changeColorEffect() {
    this.cameraPreview.setColorEffect(this.colorEffect);
  }

  changeFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode);
  }

  changeZoom() {
    this.cameraPreview.setZoom(this.setZoom);
  }

  showSupportedPictureSizes() {
    this.cameraPreview.getSupportedPictureSizes().then(
      (sizes) => {
        console.log(sizes);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
