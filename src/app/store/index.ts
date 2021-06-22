import { Subject } from "rxjs";
import { ActionTypes } from "./actions";

interface InitialState {
  loader: Object;
}

let state: InitialState = {
  loader: false,
};

interface Event {
  type: String;
  payload?: Object;
}

export const store = new Subject<InitialState>();
export const eventDispatcher = new Subject<Event>();

eventDispatcher.subscribe((data: Event) => {
  switch (data.type) {
    case ActionTypes.LOADER:
      state = {
        loader: data.payload,
      };
      store.next(state);
      break;
    default:
      break;
  }
});
