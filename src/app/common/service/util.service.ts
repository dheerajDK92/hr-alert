import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { eventDispatcher } from "src/app/store";
import { ActionTypes } from "src/app/store/actions";
@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor(public loadingController: LoadingController) {}
  showLoader() {
    eventDispatcher.next({ type: ActionTypes.LOADER, payload: true });
  }

  hideLoader() {
    eventDispatcher.next({ type: ActionTypes.LOADER, payload: false });
  }
}
