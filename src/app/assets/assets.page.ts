import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { ApiUrlService } from "../common/service/api-url.service";
import { ToastService } from "../common/service/toast.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { UtilService } from "../common/service/util.service";
import { AssetService } from "../common/service/asset.service";

@Component({
  selector: "app-assets",
  templateUrl: "./assets.page.html",
  styleUrls: ["./assets.page.scss"],
})
export class AssetsPage implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private _api: ApiUrlService,
    private _toast: ToastService,
    private _asset: AssetService,
    private _util: UtilService
  ) {}
  /**
   * variable declaration
   */
  EmpData: any;
  CmpData: any;
  main: String = "";
  isEmployeeLoading: Subscription;
  slips: any[] = [];
  formData: any = {
    employee: null,
    month: null,
  };
  /**
   * ngonit
   */
  ngOnInit() {
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
    this._api.getCompanyData().subscribe((res) => {
      this.CmpData = res;
    });

    this.main = this.activatedRoute.snapshot.paramMap.get("id");
    this.loadAssets();
  }
  /**
   * loadAssets
   */
  list = [];
  loadAssets() {
    this._util.showLoader();
    this._asset.getAsset(`/${this.CmpData._id}`).subscribe(
      (response: any) => {
        this._util.hideLoader();
        if (isNullOrUndefined(response.error)) {
          this.list = response.data.AssetDetails;
        } else {
          this._toast.showWarning("Something Went Wrong. Please try again");
        }
      },
      (err) => {
        this._util.hideLoader();
        this._toast.showWarning(err.error.error);
      }
    );
  }
}
