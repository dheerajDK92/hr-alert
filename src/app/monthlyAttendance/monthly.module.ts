import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { monthlyPageRoutingModule } from './monthly-routing.module';

import { monthlyPage } from './monthly.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    monthlyPageRoutingModule,
    CommonPageModule
  ],
  declarations: [monthlyPage]
})
export class monthlyPageModule {}
