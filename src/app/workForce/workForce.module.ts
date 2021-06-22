import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { workForcePagePageRoutingModule } from './workForce-routing.module';

import { workForcePage } from './workForce.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    workForcePagePageRoutingModule,
    CommonPageModule
  ],
  declarations: [workForcePage]
})
export class workForcePageModule {}
