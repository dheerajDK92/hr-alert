import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ApiUrlService {
  hostUrl = environment.protocol + environment.apiURL;
  empLoginLink = "/emp/login";
  dashboardLink = "/employee/dashboard";
  getEmployeeLink = "/employee/getEmployee";
  getCompanyEmployeeLink = "/employee/getCompanyEmployee";
  sendEmployeeFeedbackLink = "/employee/feedback";
  requestReimbursementLink = "/employee/reimbursement/request";
  updateReimbursementStatusLink = "/employee/reimbursement/update";
  getRequestReimbursementLink = "/employee/reimbursement/fetch";
  getRequestReimbursementForAdminLink = "/employee/reimbursement/All";
  addEmployeeLink = "/employee/register";
  updateEmployeeLink = "/employee/updateEmployee";
  deleteEmployeeLink = "/employee/deleteEmployee";
  validateIFSCLink = "/employee/ifsc/validate";
  saveBankDetailsLink = "/employee/KYC/saveBankDetails";
  getBankDetailsLink = "/employee/KYC/getBankDetails";
  requestAdvanceLink = "/employee/advance/request";
  getRequestAdvanceForAdminLink = "/employee/advance/All";
  getRequestAdvanceLink = "/employee/advance/fetch";
  updateAdvanceStatusLink = "/employee/advance/update";
  sendMailLink = "/admin/dashboard/sendMail";
  requestLeaveLink = "/employee/leave/request";
  getRequestLeaveLink = "/employee/leave/fetch";
  getRequestLeaveForAdminLink = "/employee/leave/All";
  updateLeaveStatusLink = "/employee/leave/update";
  savePunchInTimeLink = "/employee/punch/start";
  savePunchOutTimeLink = "/employee/punch/stop";
  getEmployeePunchLink = "/employee/punch/fetch";
  empFetchPunchLink = "/employee/punch/empFetch";
  startBreakLink = "/employee/break/start";
  stopBreakLink = "/employee/break/stop";
  fetchBreakLink = "/employee/break/fetch";
  getMonthlyAttendanceLink = "/employee/getMonthlyAttendance";
  getTodayWorkForceLink = "/employee/punch/fetchTodaySitePunch";
  sendSalarySlipLink = "/employee/punch/sendSalarySlip";
  getSalarySlipsLink = "/employee/punch/getSalarySlips";
  getSalaryByMonthLink = "/employee/punch/getSalaryByMonth";

  // Log Sheet
  addLogTaskLink = "/machine/logSheet/addTask";
  loadTaskLink = "/machine/logSheet/loadTask";
  updateTaskLink = "/machine/logSheet/updateTask";
  deleteTaskLink = "/machine/logSheet/deleteTask";
  scheduleTaskLink = "/machine/logSheet/scheduleTask";
  loadScheduleTaskLink = "/machine/logSheet/loadScheduleTask";
  loadPendingTaskLink = "/machine/logSheet/loadPendingTask";
  loadCompleteTaskLink = "/machine/logSheet/loadCompletedTask";
  // asset
  addAssetLink = "/asset/addAsset";
  getAssetLink = "/asset/loadAsset";

  getCompanyLink = "/emp/getCompany";
  registerEmployeeLink = "/emp/register";
  constructor() {}
  getUrl(key: String) {
    let url: any;
    if (key == "empLogin") {
      url = this.hostUrl + this.empLoginLink;
    } else if (key == "empDashboard") {
      url = this.hostUrl + this.dashboardLink;
    } else if (key == "getEmployee") {
      url = this.hostUrl + this.getEmployeeLink;
    } else if (key == "getCompanyEmployee") {
      url = this.hostUrl + this.getCompanyEmployeeLink;
    } else if (key == "sendEmployeeFeedback") {
      url = this.hostUrl + this.sendEmployeeFeedbackLink;
    } else if (key == "requestReimbursement") {
      url = this.hostUrl + this.requestReimbursementLink;
    } else if (key == "getRequestReimbursement") {
      url = this.hostUrl + this.getRequestReimbursementLink;
    } else if (key == "getRequestReimbursementForAdmin") {
      url = this.hostUrl + this.getRequestReimbursementForAdminLink;
    } else if (key == "addEmployee") {
      url = this.hostUrl + this.addEmployeeLink;
    } else if (key == "updateEmployee") {
      url = this.hostUrl + this.updateEmployeeLink;
    } else if (key == "deleteEmployee") {
      url = this.hostUrl + this.deleteEmployeeLink;
    } else if (key == "validateIFSC") {
      url = this.hostUrl + this.validateIFSCLink;
    } else if (key == "saveBankDetails") {
      url = this.hostUrl + this.saveBankDetailsLink;
    } else if (key == "getBankDetails") {
      url = this.hostUrl + this.getBankDetailsLink;
    } else if (key == "sendMail") {
      url = this.hostUrl + this.sendMailLink;
    } else if (key == "requestAdvance") {
      url = this.hostUrl + this.requestAdvanceLink;
    } else if (key == "getRequestAdvanceForAdmin") {
      url = this.hostUrl + this.getRequestAdvanceForAdminLink;
    } else if (key == "getRequestAdvance") {
      url = this.hostUrl + this.getRequestAdvanceLink;
    } else if (key == "updateReimbursementStatus") {
      url = this.hostUrl + this.updateReimbursementStatusLink;
    } else if (key == "updateAdvanceStatus") {
      url = this.hostUrl + this.updateAdvanceStatusLink;
    } else if (key == "requestLeave") {
      url = this.hostUrl + this.requestLeaveLink;
    } else if (key == "getRequestLeave") {
      url = this.hostUrl + this.getRequestLeaveLink;
    } else if (key == "getRequestLeaveForAdmin") {
      url = this.hostUrl + this.getRequestLeaveForAdminLink;
    } else if (key == "updateLeaveStatus") {
      url = this.hostUrl + this.updateLeaveStatusLink;
    } else if (key == "savePunchInTime") {
      url = this.hostUrl + this.savePunchInTimeLink;
    } else if (key == "getEmployeePunch") {
      url = this.hostUrl + this.getEmployeePunchLink;
    } else if (key == "savePunchOutTime") {
      url = this.hostUrl + this.savePunchOutTimeLink;
    } else if (key == "startBreak") {
      url = this.hostUrl + this.startBreakLink;
    } else if (key == "stopBreak") {
      url = this.hostUrl + this.stopBreakLink;
    } else if (key == "fetchBreak") {
      url = this.hostUrl + this.fetchBreakLink;
    } else if (key == "empFetchPunch") {
      url = this.hostUrl + this.empFetchPunchLink;
    } else if (key == "getMonthlyAttendance") {
      url = this.hostUrl + this.getMonthlyAttendanceLink;
    } else if (key == "addLogTask") {
      url = this.hostUrl + this.addLogTaskLink;
    } else if (key == "loadTask") {
      url = this.hostUrl + this.loadTaskLink;
    } else if (key == "updateTask") {
      url = this.hostUrl + this.updateTaskLink;
    } else if (key == "deleteTask") {
      url = this.hostUrl + this.deleteTaskLink;
    } else if (key == "getTodayWorkForce") {
      url = this.hostUrl + this.getTodayWorkForceLink;
    } else if (key == "scheduleTask") {
      url = this.hostUrl + this.scheduleTaskLink;
    } else if (key == "loadScheduleTask") {
      url = this.hostUrl + this.loadScheduleTaskLink;
    } else if (key == "loadPendingTask") {
      url = this.hostUrl + this.loadPendingTaskLink;
    } else if (key == "sendSalarySlip") {
      url = this.hostUrl + this.sendSalarySlipLink;
    } else if (key == "getSalarySlips") {
      url = this.hostUrl + this.getSalarySlipsLink;
    } else if (key == "loadCompleteTask") {
      url = this.hostUrl + this.loadCompleteTaskLink;
    } else if (key == "addAsset") {
      url = this.hostUrl + this.addAssetLink;
    } else if (key == "getAsset") {
      url = this.hostUrl + this.getAssetLink;
    } else if (key == "getSalaryDetailsByMonth") {
      url = this.hostUrl + this.getSalaryByMonthLink;
    } else if (key == "getCompany") {
      url = this.hostUrl + this.getCompanyLink;
    } else if (key == "registerEmployee") {
      url = this.hostUrl + this.registerEmployeeLink;
    }

    return url;
  }
  // userData to share between independant modules - start - dhekuma
  empId: any = null;
  empData: any = new BehaviorSubject({});
  cmpData: any = new BehaviorSubject({});
  getEmployData(): Observable<any> {
    return this.empData.asObservable();
  }

  getCompanyData(): Observable<any> {
    return this.cmpData.asObservable();
  }

  updateEmpData(update) {
    this.empData.next(update);
  }

  updateCMPData(update) {
    this.cmpData.next(update);
  }
  // userData to share between independant modules - end - dhekuma
}
