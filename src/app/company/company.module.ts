import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { companyPageRoutingModule } from './company-routing.module';

import { companyPage } from './company.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    companyPageRoutingModule,
    CommonPageModule
  ],
  declarations: [companyPage]
})
export class companyPageModule {}
