import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { punchPageRoutingModule } from './punch-routing.module';

import { punchPage } from './punch.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    punchPageRoutingModule,
    CommonPageModule
  ],
  declarations: [punchPage]
})
export class PunchPageModule {}
