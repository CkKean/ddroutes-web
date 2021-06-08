import {Component, Input, OnInit} from '@angular/core';
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";

@Component({
  selector: 'app-shipping-order-detail',
  templateUrl: './shipping-order-detail.component.html',
  styleUrls: ['./shipping-order-detail.component.scss']
})
export class ShippingOrderDetailComponent implements OnInit {

  @Input() order: CourierOrderModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
