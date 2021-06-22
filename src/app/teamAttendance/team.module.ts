import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { teamPageRoutingModule } from './team-routing.module';

import { teamPage } from './team.page';
import { CommonPageModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    teamPageRoutingModule,
    CommonPageModule
  ],
  declarations: [teamPage]
})
export class teamPageModule {}
