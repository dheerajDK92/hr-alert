import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterState } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { EmployeeService } from "../common/service/employee.service";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../common/service/authentication.service";
import { isNullOrUndefined } from "util";
import { ToastService } from "../common/service/toast.service";
import { Storage } from "@ionic/storage";
import { ApiUrlService } from "../common/service/api-url.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class mainPage implements OnInit {
  public main: string;
  public EmpData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _emp: EmployeeService,
    private _auth: AuthenticationService,
    private _toast: ToastService,
    private storage: Storage,
    private _api: ApiUrlService
  ) {}

  ngOnInit() {
    this._api.getEmployData().subscribe((res) => {
      console.log("api ===>", res);
      this.EmpData = res;
    });

    this.main = this.activatedRoute.snapshot.paramMap.get("id");
  }
}
