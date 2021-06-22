import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalarySlipReportPageRoutingModule } from './salary-slip-report-routing.module';

import { SalarySlipReportPage } from './salary-slip-report.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPageModule,
    SalarySlipReportPageRoutingModule
  ],
  declarations: [SalarySlipReportPage]
})
export class SalarySlipReportPageModule {}
