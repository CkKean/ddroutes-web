import {Action, Selector, State, StateContext} from "@ngxs/store";
import {
  ShowSessionTimeoutModal,
  DismissSessionTimeoutModal,
  DismissAccessDeniedModal,
  ShowAccessDeniedModal
} from "./modal.action";
import {Injectable} from "@angular/core";

export class ModalStateModel {
  isShowSessionTimeoutModal: boolean;
  isShowAccessDeniedModal: boolean;
}

const modelStateDefault = {
  isShowSessionTimeoutModal: false,
  isShowAccessDeniedModal: false
};

@State<ModalStateModel>({
  name: 'modalStore',
  defaults: {
    ...modelStateDefault
  }
})
@Injectable()
export class ModalState {
  //Selectors
  @Selector()
  static isShowSessionTimeoutModal(state: ModalStateModel) {
    return state.isShowSessionTimeoutModal;
  }

  @Selector()
  static isShowAccessDeniedModal(state: ModalStateModel) {
    return state.isShowAccessDeniedModal;
  }

  // Actions
  @Action(ShowSessionTimeoutModal)
  showSessionTimeoutModal(ctx: StateContext<ModalStateModel>) {
    const state = ctx.getState();
    ctx.setState({...state, isShowSessionTimeoutModal: true});
  }

  @Action(DismissSessionTimeoutModal)
  dismissSessionTimeoutModal(ctx: StateContext<ModalStateModel>) {
    const state = ctx.getState();
    ctx.setState({...state, isShowSessionTimeoutModal: false});
  }

  @Action(ShowAccessDeniedModal)
  showAccessDeniedModal(ctx: StateContext<ModalStateModel>) {
    const state = ctx.getState();
    ctx.setState({...state, isShowAccessDeniedModal: true});
  }

  @Action(DismissAccessDeniedModal)
  dismissAccessDeniedModal(ctx: StateContext<ModalStateModel>) {
    const state = ctx.getState();
    ctx.setState({...state, isShowAccessDeniedModal: false});
  }

}
