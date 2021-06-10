import {Component, Input, OnInit} from '@angular/core';
import {OrderInvoiceModel} from "../../model/courier-order/order-invoice.model";
import {SubHandlingService} from "../../services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../model/i-response";
import {CourierOrderModel} from "../../model/courier-order/courier-order.model";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {openPDF} from '../../utils/save-open-pdf.util';
import {PublicApiService} from "../../services/public-api.service";
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from "@techiediaries/ngx-qrcode";

import {Store} from "@ngxs/store";

@Component({
  selector: 'app-shipment-label',
  templateUrl: './shipment-label.component.html',
  styleUrls: ['./shipment-label.component.scss'],
  providers: [SubHandlingService]
})
export class ShipmentLabelComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() orderNo: string;

  readonly logo: string = './assets/img/brand/logo.png';
  @Input() orderInfo: OrderInvoiceModel;
  @Input() orderDetailLoading: boolean = false;
  @Input() requiredGetInfo: boolean = true;

  dimension: { width: number, height: number };
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  constructor(private subHandlingService: SubHandlingService, private publicApiService: PublicApiService, private store: Store) {
  }

  ngOnInit(): void {
    if (this.requiredGetInfo)
      this.getOrderInformation();
  }

  getOrderInformation(): void {
    this.orderDetailLoading = true;
    this.subHandlingService.subscribe(
      this.publicApiService.findByOrderNo(this.orderNo).pipe(
        tap((response: IResponse<CourierOrderModel>) => {
          if (response.success) {
            this.orderInfo = response.data;
            this.orderDetailLoading = false;
          } else {
            this.orderDetailLoading = true;
          }
        })
      )
    )
  }

  openPDF(): void {
    this.dimension = this.store.selectSnapshot(AppState.getDimension);
    let
      data = document.getElementById('shipmentLabel');
    openPDF(data, 'Shipping_' + this.orderInfo.orderNo, this.dimension);
  }

}
