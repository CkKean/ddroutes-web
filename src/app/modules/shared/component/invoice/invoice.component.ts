import {Component, Input, OnInit} from '@angular/core';
import {tap} from "rxjs/operators";
import {IResponse} from "../../model/i-response";
import {CourierOrderModel} from "../../model/courier-order/courier-order.model";
import {SubHandlingService} from "../../services/subscription-handling.service";
import {OrderInvoiceModel} from "../../model/courier-order/order-invoice.model";
import {Select, Store} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {openPDF} from '../../utils/save-open-pdf.util';
import {PublicApiService} from "../../services/public-api.service";
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from "@techiediaries/ngx-qrcode";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [SubHandlingService]
})
export class InvoiceComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() orderNo: string;
  @Input() orderInfo: OrderInvoiceModel;
  @Input() orderDetailLoading: boolean = false;
  @Input() requiredGetInfo: boolean = true;

  dimension: { width: number, height: number };
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  readonly logo: string = './assets/img/brand/logo.png';

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

  savePDF(): void {
    this.dimension = this.store.selectSnapshot(AppState.getDimension);

    let data = document.getElementById('invoivePrint');
    openPDF(data, 'Invoice_' + this.orderInfo.orderNo, this.dimension);
  }

}
