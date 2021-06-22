import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { advanceSummaryPageRoutingModule } from './advanceSummary-routing.module';

import { advanceSummaryPage } from './advanceSummary.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    advanceSummaryPageRoutingModule,
    CommonPageModule
  ],
  declarations: [advanceSummaryPage]
})
export class advanceSummaryPageModule {}
