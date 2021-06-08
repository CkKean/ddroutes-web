import {Component, Input, OnInit} from '@angular/core';
import {OrderStatusModel} from "../../model/courier-order/order-status.model";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {tap} from "rxjs/operators";
import {IResponse} from "../../model/i-response";
import {CourierOrderModel} from "../../model/courier-order/courier-order.model";
import {SubHandlingService} from "../../services/subscription-handling.service";
import {TrackingService} from "../../../order-tracking/service/tracking.service";
import {ListOfOrderType, OrderTypeConstant} from "../../../../constant/courier-order.constant";

@Component({
  selector: 'app-trace-order',
  templateUrl: './trace-order.component.html',
  styleUrls: ['./trace-order.component.scss'],
  providers: [SubHandlingService]
})
export class TraceOrderComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Input() trackingOrderNo: string;
  @Input() orderDetailLoading: boolean = false;
  @Input() orderStatus: OrderStatusModel;
  @Input() step: number;
  @Input() errorMessage: string = null;
  @Input() requiredGet: boolean = true;

  listOfOrderType = ListOfOrderType;
  orderTypeConstant = OrderTypeConstant;

  constructor(private subHandlingService: SubHandlingService, private trackingService: TrackingService) {
  }

  ngOnInit(): void {
    this.getOrderInformation();
  }

  getOrderInformation(): void {
    if (this.requiredGet) {
      this.orderDetailLoading = true;
      this.subHandlingService.subscribe(
        this.trackingService.trackOrder(this.trackingOrderNo).pipe(
          tap((response: IResponse<CourierOrderModel>) => {
            if (response.success) {
              this.orderStatus = response.data;
              this.orderDetailLoading = false;
            }
          })
        )
      )
    }
  }


}
