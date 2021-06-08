import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {SetPageValid, SetStep} from "../../state/shipping-order.action";
import {PageValidModel, ShippingOrderState} from "../../state/shipping-order.state";

@Component({
  selector: 'app-delivery-rate-table',
  templateUrl: './delivery-rate-table.component.html',
  styleUrls: ['./delivery-rate-table.component.scss']
})
export class DeliveryRateTableComponent implements OnInit {

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new SetStep({step: 0}));
    let pageValid: PageValidModel = this.store.selectSnapshot(ShippingOrderState.getPageValid);
    pageValid = {
      ...pageValid,
      deliveryRatePageValid: true
    }
    this.store.dispatch(new SetPageValid({page: pageValid}));
  }
}
