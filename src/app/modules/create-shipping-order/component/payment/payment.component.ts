import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {SetFormStatus, SetPageValid, SetPaymentMethod, SetStep} from "../../state/shipping-order.action";
import {FormStatusModel, PageValidModel, ShippingOrderState} from "../../state/shipping-order.state";
import {PaymentMethodConstant} from "../../../../constant/payment-method.constant";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() paymentMethod: string = null;
  paymentExist: boolean = null;

  paymentMethodList = PaymentMethodConstant;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new SetStep({step: 3}));
    let pageValid: PageValidModel = this.store.selectSnapshot(ShippingOrderState.getPageValid);
    pageValid = {...pageValid, paymentPageValid: true}
    this.store.dispatch(new SetPageValid({page: pageValid}));
  }

  selectMethod(method?: string): void {
    this.paymentMethod = method;

    let formStatus: FormStatusModel = this.store.selectSnapshot(ShippingOrderState.getFormStatus);
    formStatus = {...formStatus, paymentFormStatus: 'Valid'};
    this.store.dispatch(new SetFormStatus({status: formStatus}));
    this.store.dispatch(new SetPaymentMethod({method: this.paymentMethod}));
  }

  submit(): boolean {
    if (this.paymentMethod !== null) {
      return true;
    } else {
      return false;
    }
  }
}
