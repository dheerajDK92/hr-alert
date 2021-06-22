import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { aboutPageRoutingModule } from './about-routing.module';

import { aboutPage } from './about.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    aboutPageRoutingModule,
    CommonPageModule
  ],
  declarations: [aboutPage]
})
export class aboutPageModule {}
