import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { advancePageRoutingModule } from './advance-routing.module';

import { advancePage } from './advance.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    advancePageRoutingModule,
    CommonPageModule
  ],
  declarations: [advancePage]
})
export class advancePageModule {}
