import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ApiUrlService } from "../common/service/api-url.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.page.html",
  styleUrls: ["./company.page.scss"],
})
export class companyPage implements OnInit {
  public main: string;
  CmpData: any = null;
  EmpData: any = null;
  skelenton = true;
  appName = "";
  constructor(
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appName = environment.Appname;
    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    setTimeout(() => {
      this.skelenton = false;
    }, 1000);
  }
  cancelPopUp() {
    this.router.navigate(["/main/Home"]);
  }
}
