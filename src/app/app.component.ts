import { Component, OnInit, OnDestroy } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthenticationService } from "./common/service/authentication.service";
import { isNullOrUndefined } from "util";
import { environment } from "../environments/environment";
import { Router, RouterEvent, NavigationExtras } from "@angular/router";
import { Subscription, Observable, fromEvent, Subscriber } from "rxjs";
import { ToastService } from "./common/service/toast.service";
import { EmployeeService } from "./common/service/employee.service";
import { ApiUrlService } from "./common/service/api-url.service";
import { eventDispatcher, store } from "src/app/store/index";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  appName = environment.Appname;
  private hrEmail = environment.hrEmail;
  public selectedIndex = 0;
  public selectedIndexInfo = null;
  public selectedIndexReports = null;
  public selectedIndexOthers = null;
  public selectedIndexUnAuth = null;
  public isLoggedIn = false;
  private isEmpDataLoad: Subscription;
  subscriptions: Subscription[] = [];
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  offLine: boolean = false;
  showLoader: any = false;
  public appPages = [
    {
      title: "Home",
      url: "/main/Home",
      icon: "home",
    },
    {
      title: "Punch Attendance",
      url: "/punch/Punch Attendance",
      icon: "finger-print",
    },
    {
      title: "Break Time",
      url: "/break/Break Time",
      icon: "pause-circle",
    },
    {
      title: "Reimbursement",
      url: "/empReimbursement/Reimbursement",
      icon: "newspaper",
    },
    {
      title: "Advance",
      url: "/advance/Advance",
      icon: "newspaper",
    },
    {
      title: "Leave",
      url: "/empLeave/Apply for Leave",
      icon: "newspaper",
    },
  ];

  public appInfoPages = [];

  public appInfoReport = [
    {
      title: "Reports",
      url: "/report/Reports",
      icon: "person",
    },
  ];
  public appInfoOthers = [
    {
      title: "About",
      url: "/about/About",
      icon: "location",
    },
    {
      title: "Feedback",
      url: "/feedback/Feedback",
      icon: "newspaper",
    },
  ];
  public appUnAuthPages = [
    {
      title: "Login",
      url: "/loginWithEmail",
      icon: "person",
    },
    {
      title: "Sign Up",
      url: "/signUp",
      icon: "person",
    },
  ];
  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  public appRefresh = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _auth: AuthenticationService,
    private router: Router,
    private _toast: ToastService,
    private _emp: EmployeeService,
    private _api: ApiUrlService
  ) {
    this.initializeApp();
    store.subscribe((state) => {
      const { loader } = state;
      this.showLoader = loader;
    });
  }
  selectedPath = "";
  employData: any;
  /**
   * initializeApp(): after platform ready initiate the app
   */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.router.events.subscribe((event: RouterEvent) => {
        if (event && event.url) {
          this.selectedPath = event.url;
        }
        this.checkLoginStatus();
      });
      this._auth.firstTimeApp.subscribe((state) => {
        this.reloadScreen(); // TODO need to remove during PROD deployment
        if (state) {
          this.router.navigate(["/startApp"]);
        } else {
          this._auth.authenticateionState.subscribe((state) => {
            if (state) {
              if (this.isEmpDataLoad) {
                this.isEmpDataLoad.unsubscribe();
              }
              this.isEmpDataLoad = this._emp
                .getEmployeeDetail(this._auth.empId)
                .subscribe(
                  (response: any) => {
                    if (isNullOrUndefined(response.error)) {
                      this.employData = response.data.employeeData[0];
                      this.initSideBar();
                      this._api.updateEmpData(this.employData);
                      this._api.updateCMPData(response.data.CompanyDetail[0]);
                      this.navigateTo("/main/Home");
                      this.isLoggedIn = true;
                    } else {
                      this.isLoggedIn = true;
                      this.navigateTo("/loginWithEmail");
                      this._toast.showWarning(
                        "Something Went Wrong. Please try again"
                      );
                    }
                  },
                  (err) => {
                    this.isLoggedIn = true;
                    this.navigateTo("/loginWithEmail");
                    this._toast.showWarning(err.error.error);
                  }
                );
            } else {
              this.navigateTo("/loginWithEmail");
            }
          });
        }
      });
      /**
       * checkToken() check token
       */
      this._auth.checkToken();
      /**
       * initOfflineOnlineEvent() : init internet offline online event
       */
      this.initOfflineOnlineEvent();
    });
  }
  /**
   *
   * @param url
   */
  initSideBar() {
    if (this.employData.isHrAdmin) {
      this.appInfoPages = [
        {
          title: "Employee Directory",
          url: "/empDirectory/Directory",
          icon: "person",
        },
        {
          title: "Company",
          url: "/company/Company",
          icon: "people",
        },
      ];
    } else {
      this.appInfoPages = [
        {
          title: "Company",
          url: "/company/Company",
          icon: "people",
        },
      ];
    }
  }
  /**
   *navigateTo(): navigate to router
   */
  navigateTo(url) {
    this.router.navigate([url]);
  }
  /**
   * initOfflineOnlineEvent(): subscription methods for internet off/on
   */
  initOfflineOnlineEvent() {
    // online/offline event - start
    this.onlineEvent = fromEvent(window, "online");
    this.offlineEvent = fromEvent(window, "offline");
    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        this._toast.showWarning(`Back To Internet.`);
        this.offLine = false;
        console.log("Online...");
      })
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        this._toast.showWarning(`You are disconnected from Internet.`);
        this.offLine = true;
        console.log("Offline...");
      })
    );
  }
  /**
   * reload the screen for refresh the sidebar
   */
  reloadScreen() {
    this.appRefresh = false;
    setTimeout(() => {
      this.appRefresh = true;
    }, 1000);
  }
  /**
   * ngOnInit(): get the header title from router
   */
  ngOnInit() {
    const path = window.location.pathname.split("main/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
  /**
   * checkLoginStatus(): get the login status
   */
  checkLoginStatus() {
    this.isLoggedIn = this._auth.isAuthenticated();
  }
  /**
   * ngOnDestroy() : destroy subscribe data
   */
  ngOnDestroy(): void {
    if (this.isEmpDataLoad) {
      this.isEmpDataLoad.unsubscribe();
    }
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
