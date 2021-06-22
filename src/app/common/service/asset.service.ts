import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiUrlService } from "./api-url.service";
@Injectable({
  providedIn: "root",
})
export class AssetService {
  constructor(private apiRUL: ApiUrlService, private _http: HttpClient) {}

  addAsset(data) {
    const apiURL = this.apiRUL.getUrl("addAsset");
    return this._http.post(apiURL, data);
  }

  getAsset(data) {
    const apiURL = this.apiRUL.getUrl("getAsset");
    return this._http.get(apiURL + data);
  }
}
