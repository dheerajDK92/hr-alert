import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { reportsPageRoutingModule } from './reports-routing.module';

import { reportsPage } from './reports.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    reportsPageRoutingModule,
    CommonPageModule
  ],
  declarations: [reportsPage]
})
export class reportsPageModule {}
