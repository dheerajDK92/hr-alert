import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "../../environments/environment";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthenticationService } from "../common/service/authentication.service";

@Component({
  selector: "app-start-app",
  templateUrl: "./start-app.component.html",
  styleUrls: ["./start-app.component.scss"],
})
export class StartAppComponent implements OnInit {
  appName = environment.Appname;
  startAppSliderOptions = {
    initialSlide: 0,
    speed: 400,
  };
  permissionAppSliderOptions = {
    initialSlide: 0,
    speed: 400,
  };
  activeSliderIndex: number = 0;
  @ViewChild("walkMeSlider") walkMeSlider: any;
  constructor(private router: Router, private _auth: AuthenticationService) {}
  ngOnInit() {}

  nextSlide() {
    this.walkMeSlider.slideNext();
  }

  previousSlide() {
    this.walkMeSlider.slidePrev();
  }

  start() {
    this.walkMeSlider.slideNext();
  }

  SlideChanges(event:any) {
    this.walkMeSlider.getActiveIndex().then((index: number) => {
      this.activeSliderIndex = index;
    });
  }

  launchPermission() {
    this._auth.walkMeCompleted();
    this.router.navigate(["/loginWithEmail"]);
  }
}
