import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy, NavParams } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { StartAppComponent } from "./start-app/start-app.component";
import { CommonPageModule } from "./common/common.module";
import { IonicStorageModule } from "@ionic/storage";
import { OffLineComponent } from "./off-line/off-line.component";
import { LoginWithEmailComponent } from "./login-with-email/login-with-email.component";
import { AuthInterceptorService } from "./common/service/auth-interceptor.service";
import { Calendar } from "@ionic-native/calendar/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { CameraPreview } from "@ionic-native/camera-preview/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { SignUpComponent } from "./sign-up/sign-up.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginWithEmailComponent,
    SignUpComponent,
    OffLineComponent,
    StartAppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Geolocation,
    Camera,
    Calendar,
    NavParams,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    FileOpener,
    File,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
