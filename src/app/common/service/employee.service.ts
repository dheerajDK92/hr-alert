import { Injectable } from "@angular/core";
import { ApiUrlService } from "./api-url.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private _apiURL: ApiUrlService, private _http: HttpClient) {}

  getEmployeeDetail(id) {
    const url = this._apiURL.getUrl("getEmployee") + "/" + id;
    return this._http.get(url);
  }

  getCompanyEmployeeDetail(id) {
    const apiURL = this._apiURL.getUrl("getCompanyEmployee") + "/" + id;
    return this._http.get(apiURL);
  }

  getSalarySlips(id) {
    const apiURL = this._apiURL.getUrl("getSalarySlips") + "/" + id;
    return this._http.get(apiURL);
  }
  
  getTodayWorkForce(data) {
    const apiURL = this._apiURL.getUrl("getTodayWorkForce");
    return this._http.post(apiURL, data);
  }

  sendFeedback(data) {
    const apiURL = this._apiURL.getUrl("sendEmployeeFeedback");
    return this._http.post(apiURL, data);
  }

  requestReimbursement(data) {
    const apiURL = this._apiURL.getUrl("requestReimbursement");
    return this._http.post(apiURL, data);
  }

  requestLeave(data) {
    const apiURL = this._apiURL.getUrl("requestLeave");
    return this._http.post(apiURL, data);
  }

  getRequestReimbursement(id) {
    const apiURL = this._apiURL.getUrl("getRequestReimbursement") + "/" + id;
    return this._http.get(apiURL);
  }

  getRequestReimbursementForAdmin(companyId) {
    const apiURL =
      this._apiURL.getUrl("getRequestReimbursementForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  getRequestAdvanceForAdmin(companyId) {
    const apiURL =
      this._apiURL.getUrl("getRequestAdvanceForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  getRequestAdvance(id) {
    const apiURL = this._apiURL.getUrl("getRequestAdvance") + "/" + id;
    return this._http.get(apiURL);
  }

  registerEmployee(data) {
    const url = this._apiURL.getUrl("addEmployee");
    return this._http.post(url, data);
  }

  updateEmployee(data) {
    const url = this._apiURL.getUrl("updateEmployee");
    return this._http.put(url, data);
  }

  deleteEmployee(data) {
    const options: any = {
      body: {
        _id: data._id,
      },
    };
    const url = this._apiURL.getUrl("deleteEmployee");
    return this._http.delete(url, options);
  }

  validateIFSC(ifsc) {
    const url = this._apiURL.getUrl("validateIFSC") + "/" + ifsc;
    return this._http.get(url);
  }

  saveBankDetails(data) {
    const url = this._apiURL.getUrl("saveBankDetails");
    return this._http.post(url, data);
  }

  getBankDetails(empId) {
    const url = this._apiURL.getUrl("getBankDetails") + "/" + empId;
    return this._http.get(url);
  }

  sendMail(data) {
    const url = this._apiURL.getUrl("sendMail");
    return this._http.post(url, data);
  }

  requestAdvance(data) {
    const apiURL = this._apiURL.getUrl("requestAdvance");
    return this._http.post(apiURL, data);
  }

  updateReimbursementStatus(data) {
    const apiURL = this._apiURL.getUrl("updateReimbursementStatus");
    return this._http.put(apiURL, data);
  }

  updateAdvanceStatus(data) {
    const apiURL = this._apiURL.getUrl("updateAdvanceStatus");
    return this._http.put(apiURL, data);
  }
  getCurrentLocationDetail(lat, long) {
    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${environment.googleMapKey}`;
    return this._http.get(apiURL);
  }

  getRequestLeave(id) {
    const apiURL = this._apiURL.getUrl("getRequestLeave") + "/" + id;
    return this._http.get(apiURL);
  }

  getRequestLeaveForAdmin(companyId) {
    const apiURL =
      this._apiURL.getUrl("getRequestLeaveForAdmin") + "/" + companyId;
    return this._http.get(apiURL);
  }

  updateLeaveStatus(data) {
    const apiURL = this._apiURL.getUrl("updateLeaveStatus");
    return this._http.put(apiURL, data);
  }

  savePunchInTime(data) {
    const apiURL = this._apiURL.getUrl("savePunchInTime");
    return this._http.post(apiURL, data);
  }

  sendSalarySlip(data) {
    const apiURL = this._apiURL.getUrl("sendSalarySlip");
    return this._http.post(apiURL, data);
  }

  savePunchOutTime(data) {
    const apiURL = this._apiURL.getUrl("savePunchOutTime");
    return this._http.put(apiURL, data);
  }

  getEmployeePunch(date) {
    const apiURL = this._apiURL.getUrl("getEmployeePunch");
    return this._http.post(apiURL, date);
  }

  getMonthlyAttendance(date) {
    const apiURL = this._apiURL.getUrl("getMonthlyAttendance");
    return this._http.post(apiURL, date);
  }
  
  empFetchPunch(date) {
    const apiURL = this._apiURL.getUrl("empFetchPunch");
    return this._http.post(apiURL, date);
  }

  getAddress(apiURL) {
    return this._http.get(apiURL);
  }

  

  startBreak(data) {
    const apiURL = this._apiURL.getUrl("startBreak");
    return this._http.post(apiURL, data);
  }

  stopBreak(data) {
    const apiURL = this._apiURL.getUrl("stopBreak");
    return this._http.put(apiURL, data);
  }

  fetchBreak(data) {
    const apiURL = this._apiURL.getUrl("fetchBreak");
    return this._http.post(apiURL, data);
  }

  getSalaryDetailsByMonth(data) {
    const apiURL = this._apiURL.getUrl("getSalaryDetailsByMonth");
    return this._http.post(apiURL, data);
  }

}
