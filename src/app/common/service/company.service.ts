import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  constructor(private apiRUL: ApiUrlService, private _http: HttpClient) {}

  getCompanyList() {
    const url = this.apiRUL.getUrl("getCompany");
    return this._http.get(url);
  }

  registerEmployee(data) {
    const url = this.apiRUL.getUrl("registerEmployee");
    return this._http.post(url, data);
  }
}
