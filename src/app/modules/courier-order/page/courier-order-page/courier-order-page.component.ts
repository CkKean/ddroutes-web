import {Component, OnInit} from '@angular/core';
import {CourierOrderRestService} from "../../service/courier-order.rest.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {IResponse} from "../../../shared/model/i-response";

@Component({
  templateUrl: './courier-order-page.component.html',
  styleUrls: ['./courier-order-page.component.scss'],
  providers: [SubHandlingService]
})
export class CourierOrderPageComponent implements OnInit {

  courierOrderList: CourierOrderModel[];
  orderLoading: boolean = false;

  constructor(private courierOrderService: CourierOrderRestService,
              private subHandlingService: SubHandlingService) {
  }

  ngOnInit(): void {
    this.getAllCourierOrder();
  }

  getAllCourierOrder(): void {
    this.orderLoading = true;
    this.subHandlingService.subscribe(
      this.courierOrderService.findAll().pipe(
        tap((response: IResponse<CourierOrderModel[]>) => {
          this.courierOrderList = response.data;
          this.orderLoading = false;
        })
      )
    );
  }
}
