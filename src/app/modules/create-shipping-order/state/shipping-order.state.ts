import {CourierOrderModel} from "../../shared/model/courier-order/courier-order.model";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {
  ResetShippingOrder,
  SetFormStatus,
  SetOrder,
  SetPageValid,
  SetPaymentMethod,
  SetQuotationForm,
  SetStep
} from "./shipping-order.action";

export class PageValidModel {
  deliveryRatePageValid: boolean;
  orderPageValid: boolean;
  summaryPageValid: boolean;
  paymentPageValid: boolean;
  completedPageValid: boolean;
}

export class FormStatusModel {
  orderFormStatus: string;
  paymentFormStatus: string;
}

export class ShippingOrderStateModel {
  order: CourierOrderModel;
  step: number;
  quotationForm: any;

  pageValid: PageValidModel;
  formStatus: FormStatusModel;
}

const shippingOrderStateDefault: ShippingOrderStateModel = {
  order: null,
  step: 0,
  quotationForm: null,
  pageValid: {
    deliveryRatePageValid: false,
    orderPageValid: false,
    summaryPageValid: false,
    paymentPageValid: false,
    completedPageValid: false,
  },
  formStatus: {
    orderFormStatus: null,
    paymentFormStatus: null,
  }
}

@State<ShippingOrderStateModel>({
  name: 'shippingOrderState',
  defaults: {
    ...shippingOrderStateDefault
  }
})
@Injectable()
export class ShippingOrderState {
  constructor() {
  }

  @Selector()
  static getOrder(state: ShippingOrderStateModel) {
    return state.order;
  }

  @Selector()
  static getStep(state: ShippingOrderStateModel) {
    return state.step;
  }

  @Selector()
  static getPageValid(state: ShippingOrderStateModel) {
    return state.pageValid;
  }

  @Selector()
  static getFormStatus(state: ShippingOrderStateModel) {
    return state.formStatus;
  }

  @Action(SetPageValid)
  setPageValid(ctx: StateContext<ShippingOrderStateModel>, action: SetPageValid) {
    const state = ctx.getState();
    ctx.setState({...state, pageValid: action.payload.page});
  }

  @Action(SetFormStatus)
  setFormStatus(ctx: StateContext<ShippingOrderStateModel>, action: SetFormStatus) {
    const state = ctx.getState();
    ctx.setState({...state, formStatus: action.payload.status});
  }


  @Selector()
  static getQuotationForm(state: ShippingOrderStateModel) {
    return state.quotationForm;
  }

  @Action(SetStep)
  setStep(ctx: StateContext<ShippingOrderStateModel>, action: SetStep) {
    const state = ctx.getState();
    ctx.setState({...state, step: action.payload.step});
  }

  @Action(SetOrder)
  setOrder(ctx: StateContext<ShippingOrderStateModel>, action: SetOrder) {
    const state = ctx.getState();
    ctx.setState({...state, order: action.payload.order});
  }


  @Action(SetQuotationForm)
  setQuotationForm(ctx: StateContext<ShippingOrderStateModel>, action: SetQuotationForm) {
    const state = ctx.getState();
    ctx.setState({
      ...state, quotationForm: {
        fromAddress: action.payload.fromAddress,
        toAddress: action.payload.toAddress,
        weight: action.payload.weight
      }
    });
  }

  @Action(SetPaymentMethod)
  setPaymentMethod(ctx: StateContext<ShippingOrderStateModel>, action: SetPaymentMethod) {
    let state = ctx.getState();
    state = {
      ...state,
      order: {
        ...state.order,
        paymentMethod: action.payload.method
      }
    };
    ctx.setState(state);
  }

  @Action(ResetShippingOrder)
  resetShippingOrder(ctx: StateContext<ShippingOrderStateModel>, action: ResetShippingOrder) {
    ctx.setState(shippingOrderStateDefault);
  }
}
