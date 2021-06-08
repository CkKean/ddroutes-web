import {Component, OnInit} from '@angular/core';
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {PageValidModel, ShippingOrderState} from "../../state/shipping-order.state";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {Store} from "@ngxs/store";
import {SetOrder, SetPageValid, SetStep} from "../../state/shipping-order.action";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ShippingOrderService} from "../../../shipping-order/service/shipping-order.service";

@Component({
  selector: 'app-shipping-order-overview',
  templateUrl: './shipping-order-overview.component.html',
  styleUrls: ['./shipping-order-overview.component.scss']
})
export class ShippingOrderOverviewComponent implements OnInit {

  @SelectSnapshot(ShippingOrderState.getOrder) order: CourierOrderModel;

  overViewLoading: boolean = false;
  displayData: CourierOrderModel;

  constructor(private store: Store,
              private shippingOrderService: ShippingOrderService,
              private subHandlingService: SubHandlingService,) {

  }

  ngOnInit(): void {
    this.store.dispatch(new SetStep({step: 2}));
    let pageValid: PageValidModel = this.store.selectSnapshot(ShippingOrderState.getPageValid);
    pageValid = {...pageValid, summaryPageValid: true}
    this.store.dispatch(new SetPageValid({page: pageValid}));
    this.getShippingCost();
  }

  getShippingCost(): void {
    this.overViewLoading = true;
    this.subHandlingService.subscribe(
      this.shippingOrderService.getShippingCost(this.order).pipe(
        tap((response: IResponse<number>) => {
          if (response.success) {
            this.displayData = {...this.order, shippingCost: response.data};
            this.store.dispatch(new SetOrder({order: this.displayData}));
            this.overViewLoading = false;
          }
        })
      )
    )
  }


}
