import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {ShippingOrderService} from "../../service/shipping-order.service";
import {ShipmentLabelComponent} from "../../../shared/component/shipment-label/shipment-label.component";
import {InvoiceComponent} from "../../../shared/component/invoice/invoice.component";

@Component({
  templateUrl: './shipping-order-summary.component.html',
  styleUrls: ['./shipping-order-summary.component.scss'],
  providers: [SubHandlingService]
})
export class ShippingOrderSummaryComponent implements OnInit {

  orderNo: string;
  orderInfo: CourierOrderModel;
  orderDetailLoading: boolean = false;

  @ViewChild(InvoiceComponent) invoiceComponent: InvoiceComponent;
  @ViewChild(ShipmentLabelComponent) shipmentLabelComponent: ShipmentLabelComponent;

  constructor(private shippingOrderService: ShippingOrderService,
              private subHandlingService: SubHandlingService,
              private route: ActivatedRoute,
              private modal: ModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams !== {}) {
      this.orderNo = this.route.snapshot.queryParams['orderNo'];
      this.getOrderInformation();
    } else {
      this.modal.promptWarningModal('Shipping order does not exist.', null, 'OK', './');
    }
  }

  getOrderInformation(): void {
    this.orderDetailLoading = true;
    this.subHandlingService.subscribe(
      this.shippingOrderService.findByOrderNo(this.orderNo).pipe(
        tap((response: IResponse<CourierOrderModel>) => {
          if (response.success) {
            this.orderInfo = response.data;
            this.orderDetailLoading = false;
          } else {
            this.modal.promptWarningModal('Shipping order does not exist.', null, 'OK', './');
          }
        })
      )
    )
  }

  downloadInvoice(evt): void {
    evt.stopPropagation();
    this.invoiceComponent.savePDF();
  }

  downloadShipment(evt): void {
    evt.stopPropagation();
    this.shipmentLabelComponent.openPDF();
  }

}
