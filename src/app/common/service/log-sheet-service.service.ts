import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";

@Injectable({
  providedIn: "root",
})
export class LogSheetServiceService {
  constructor(private _apiURL: ApiUrlService, private _http: HttpClient) {}
  /**
   *
   * add task- start
   */
  addTask(data) {
    const url = this._apiURL.getUrl("addLogTask");
    return this._http.post(url, data);
  }

  updateTask(data) {
    const url = this._apiURL.getUrl("updateTask");
    return this._http.put(url, data);
  }

  deleteTask(data) {
    const options: any = {
      body: {
        _id: data._id,
      },
    };
    const url = this._apiURL.getUrl("deleteTask");
    return this._http.delete(url, options);
  }

  loadTask(companyID) {
    const url = this._apiURL.getUrl("loadTask") + `/${companyID}`;
    return this._http.get(url);
  }

  loadPendingTask(companyID) {
    const url = this._apiURL.getUrl("loadPendingTask") + `/${companyID}`;
    return this._http.get(url);
  }

  /**
   * schedule task-start
   */
  scheduleTask(data) {
    const url = this._apiURL.getUrl("scheduleTask");
    return this._http.post(url, data);
  }

  loadScheduleTask(companyID) {
    const url = this._apiURL.getUrl("loadScheduleTask") + `/${companyID}`;
    return this._http.get(url);
  }
  loadCompleteTask(companyID){
    const url = this._apiURL.getUrl("loadCompleteTask") + `/${companyID}`;
    return this._http.get(url);
  }
}
