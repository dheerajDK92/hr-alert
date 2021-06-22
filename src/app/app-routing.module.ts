import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthGuardService } from "./common/service/auth-guard.service";
import { StartAppComponent } from "./start-app/start-app.component";
import { LoginWithEmailComponent } from "./login-with-email/login-with-email.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canActivate: [AuthGuardService],
  },
  // { path: "**", redirectTo: "login", canActivate: [AuthGuardService] },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signUp",
    component: SignUpComponent,
  },
  {
    path: "loginWithEmail",
    component: LoginWithEmailComponent,
  },
  {
    path: "startApp",
    component: StartAppComponent,
  },
  {
    path: "main/:id",
    loadChildren: () =>
      import("./main/main.module").then((m) => m.mainPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "punch/:id",
    loadChildren: () =>
      import("./punchAttendance/punch.module").then((m) => m.PunchPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "team/:id",
    loadChildren: () =>
      import("./teamAttendance/team.module").then((m) => m.teamPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "monthly/:id",
    loadChildren: () =>
      import("./monthlyAttendance/monthly.module").then(
        (m) => m.monthlyPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "break/:id",
    loadChildren: () =>
      import("./breakTime/break.module").then((m) => m.breakPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "advance/:id",
    loadChildren: () =>
      import("./advance/advance.module").then((m) => m.advancePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "advanceSummary/:id",
    loadChildren: () =>
      import("./main/main.module").then((m) => m.mainPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "advanceSummaryPage/:id",
    loadChildren: () =>
      import("./advanceSummary/advanceSummary.module").then(
        (m) => m.advanceSummaryPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "employee/:id",
    loadChildren: () =>
      import("./employee/employee.module").then((m) => m.employeePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "company/:id",
    loadChildren: () =>
      import("./company/company.module").then((m) => m.companyPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "report/:id",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.reportsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "about/:id",
    loadChildren: () =>
      import("./about/about.module").then((m) => m.aboutPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "feedback/:id",
    loadChildren: () =>
      import("./feedback/feedback.module").then((m) => m.feedbackPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "empDashboard/:id",
    loadChildren: () =>
      import("./employeeDashboard/employeeDashboard.module").then(
        (m) => m.employeeDashboardPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "empDirectory/:id",
    loadChildren: () =>
      import("./employeeDirectory/employeeDirectory.module").then(
        (m) => m.employeeDirectoryPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "empReimbursement/:id",
    loadChildren: () =>
      import("./employeeReimbursement/employeeReimbursement.module").then(
        (m) => m.employeeReimbursementPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "empReimbursementSummary/:id",
    loadChildren: () =>
      import(
        "./employeeReimbursementSummary/employeeReimbursementSummary.module"
      ).then((m) => m.employeeReimbursementPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "empLeave/:id",
    loadChildren: () =>
      import("./employeeLeave/employeeLeave.module").then(
        (m) => m.employeeLeavePageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "empLeaveSummary/:id",
    loadChildren: () =>
      import("./employeeLeaveSummary/employeeLeaveSummary.module").then(
        (m) => m.employeeLeaveSummaryPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "scan-qr/:id",
    loadChildren: () =>
      import("./scan-qr/scan-qr.module").then((m) => m.ScanQrPageModule),
  },
  {
    path: "download-site-qrcode/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./download-site-qrcode/download-site-qrcode.module").then(
        (m) => m.DownloadSiteQRCodePageModule
      ),
  },
  {
    path: "log-sheet/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./log-sheet/log-sheet.module").then((m) => m.LogSheetPageModule),
  },
  {
    path: "generate-salary-slip/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./generate-salary-slip/generate-salary-slip.module").then(
        (m) => m.GenerateSalarySlipPageModule
      ),
  },
  {
    path: "workForce/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./workForce/workForce.module").then((m) => m.workForcePageModule),
  },
  {
    path: "salary-slip/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./salary-slip/salary-slip.module").then(
        (m) => m.SalarySlipPageModule
      ),
  },
  {
    path: "salary-slip-report/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./salary-slip-report/salary-slip-report.module").then(
        (m) => m.SalarySlipReportPageModule
      ),
  },
  {
    path: "assets/:id",
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("./assets/assets.module").then((m) => m.AssetsPageModule),
  },
  {
    path: "salary-slip-report",
    loadChildren: () =>
      import("./salary-slip-report/salary-slip-report.module").then(
        (m) => m.SalarySlipReportPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
