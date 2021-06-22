import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HeaderComponent } from "./component/header/header.component";
import { MorePopOverComponent } from "./component/more-pop-over/more-pop-over.component";
import { SkeletonComponent } from "./component/skeleton/skeleton.component";
import { AuthenticationService } from "./service/authentication.service";
import { AuthGuardService } from "./service/auth-guard.service";
import { qrComponent } from "./component/qrCode/qrCode.component";
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NgxQRCodeModule,],
  providers: [AuthGuardService, AuthenticationService,],
  exports: [
    HeaderComponent,
    MorePopOverComponent,
    SkeletonComponent,
    NgxQRCodeModule,
  ],
  declarations: [
    HeaderComponent,
    MorePopOverComponent,
    SkeletonComponent,
    qrComponent,
  ],
  entryComponents: [MorePopOverComponent, SkeletonComponent,],
})
export class CommonPageModule {}
