import {Action, Selector, State, StateContext} from "@ngxs/store";
import {SetBrowser, SetPlatform, SetScreenDimension} from "./app.action";
import {Injectable} from "@angular/core";

export class AppStateModel {
  dimensions: {
    width: number,
    height: number
  };
  isMobile: boolean;
  browser: string;
  platform: string;
}

const appStateDefault: AppStateModel = {
  dimensions: {
    width: null,
    height: null,
  },
  isMobile: null,
  browser: null,
  platform: null
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    ...appStateDefault
  }
})
@Injectable()
export class AppState {
  constructor() {
  }

  @Selector()
  static isMobile(state: AppStateModel) {
    return state.isMobile;
  }

  @Action(SetScreenDimension)
  setScreenDimension(ctx: StateContext<AppStateModel>, action: SetScreenDimension) {
    const state = ctx.getState();
    ctx.setState(
      {
        ...state,
        dimensions: {
          width: action.payload.width,
          height: action.payload.height
        },
        isMobile: action.payload.width < 768
      }
    );
  }

  @Action(SetBrowser)
  setBrowser(ctx: StateContext<AppStateModel>, action: SetBrowser) {
    const state = ctx.getState();
    ctx.setState(
      {
        ...state,
        browser: action.payload
      }
    );
  }

  @Action(SetPlatform)
  setPlatform(ctx: StateContext<AppStateModel>, action: SetPlatform) {
    const state = ctx.getState();
    ctx.setState(
      {
        ...state,
        platform: action.payload
      }
    );
  }
}
