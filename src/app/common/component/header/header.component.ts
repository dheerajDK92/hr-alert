import { Component, OnInit, Input } from "@angular/core";
import { ModalController, PopoverController } from "@ionic/angular";
import { MorePopOverComponent } from "../more-pop-over/more-pop-over.component";
import { MenuController } from "@ionic/angular";
import { ApiUrlService } from '../../service/api-url.service';
import { qrComponent } from './../qrCode/qrCode.component';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  constructor(
    private popoverController: PopoverController,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public _api: ApiUrlService
  ) {}
  @Input("headerText") headerText: any;
  EmpData:any
  ngOnInit() {
    this._api.getEmployData().subscribe((res) => {
      this.EmpData = res;
    });
  }

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MorePopOverComponent,
      event: ev,
      componentProps: { page: this.headerText },
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }

  toggleHeaderMenu() {
    this.menuCtrl.toggle();
  }

  async showQRCode() {
    const modal = await this.modalController.create({
      component: qrComponent,
      cssClass: "addLogoPage",
      componentProps: {
        empData: this.EmpData,
      },
    });
    return await modal.present();
  }
}
