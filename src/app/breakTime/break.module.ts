import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { breakPageRoutingModule } from './break-routing.module';

import { breakPage } from './break.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    breakPageRoutingModule,
    CommonPageModule
  ],
  declarations: [breakPage]
})
export class breakPageModule {}
