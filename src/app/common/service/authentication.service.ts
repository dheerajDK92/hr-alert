import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import { ApiUrlService } from "./api-url.service";

@Injectable()
export class AuthenticationService {
  authenticateionState = new BehaviorSubject(false);
  firstTimeApp = new BehaviorSubject(true);
  token: any = null;
  empId: any = null;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private plt: Platform,
    private apiRUL: ApiUrlService
  ) {
    this.plt.ready().then(() => {
      // this.logout();
      // this.removeFirstTime();
      this.checkToken();
    });
  }

  isAuthenticated(): any {
    return this.authenticateionState.value;
  }

  isFirstTimeAppOpen(): any {
    return this.firstTimeApp.value;
  }
  // Login Method
  login(data) {
    const url = this.apiRUL.getUrl("empLogin");
    return this.http.post(url, data);
  }
  // set token
  setloginToken(token) {
    this.token = token;
    return this.storage.set(environment.TOKEN_KEY, token).then((res) => {
      this.authenticateionState.next(true);
    });
  }

  setUserId(id) {
    this.empId = id;
    return this.storage.set("empId", id).then((res) => {
      console.log("empId set");
    });
  }

  // get token
  getloginToken() {
    return this.storage.get(environment.TOKEN_KEY).then((token) => {
      if (token) {
        this.authenticateionState.next(true);
      }
    });
  }
  // logout token
  logout() {
    this.token = null;
    this.empId = null;
    this.storage.remove(environment.TOKEN_KEY).then((res) => {
      this.authenticateionState.next(false);
    });
    this.storage.remove("empId").then((res) => {
      //
    });
  }
  // Check Token after Refresh
  checkToken() {
    this.storage.get(environment.TOKEN_KEY).then((res) => {
      if (res) {
        this.token = res;
        this.authenticateionState.next(true);
      }
    });
    this.storage.get("empId").then((res) => {
      if (res) {
        this.empId = res;
      }
    });
    this.storage.get(environment.firstTime).then((res) => {
      if (res) {
        this.firstTimeApp.next(false);
      }
    });
  }

  checkFirstTimeUser() {
    return this.storage.get(environment.firstTime).then((res) => {
      if (res) {
        this.firstTimeApp.next(false);
      }
    });
  }

  walkMeCompleted() {
    return this.storage.set(environment.firstTime, "false").then((res) => {
      this.firstTimeApp.next(false);
    });
  }

  removeFirstTime() {
    return this.storage.remove(environment.firstTime).then((res) => {
      this.firstTimeApp.next(true);
    });
  }
}
