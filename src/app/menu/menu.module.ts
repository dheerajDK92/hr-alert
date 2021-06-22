import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { menuPageRoutingModule } from './menu-routing.module';

import { menuPage } from './menu.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    menuPageRoutingModule,
    CommonPageModule
  ],
  declarations: [menuPage]
})
export class menuPageModule {}
