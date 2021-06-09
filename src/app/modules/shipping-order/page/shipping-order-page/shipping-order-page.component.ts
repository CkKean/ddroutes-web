import {Component, OnInit, ViewChild} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {deepCopy} from "../../../shared/utils/common.util";
import {ShipmentLabelComponent} from "../../../shared/component/shipment-label/shipment-label.component";
import {InvoiceComponent} from "../../../shared/component/invoice/invoice.component";
import {ShippingOrderService} from "../../service/shipping-order.service";
import {IResponse} from "../../../shared/model/i-response";
import {tap} from "rxjs/operators";
import {OrderTypeConstant} from "../../../../constant/courier-order.constant";
import {ShippingOrderModel} from "../../../shared/model/courier-order/shipping-order-model";

@Component({
  selector: 'app-shipping-order-page',
  templateUrl: './shipping-order-page.component.html',
  styleUrls: ['./shipping-order-page.component.scss'],
  providers: [SubHandlingService]
})
export class ShippingOrderPageComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @ViewChild(ShipmentLabelComponent) shipmentLabelComponent: ShipmentLabelComponent;
  @ViewChild(InvoiceComponent) invoiceComponent: InvoiceComponent;

  oriData: ShippingOrderModel;
  displayData: CourierOrderModel[];
  failedList: CourierOrderModel[];
  pendingList: CourierOrderModel[];
  pickedUpList: CourierOrderModel[];
  inProgressList: CourierOrderModel[];
  completedList: CourierOrderModel[];
  dataLoading: boolean = false;

  tabCurrentIndex: number = 0;

  tableHeader = [
    {title: 'No.', nzWidth: '60px'},
    {title: 'Order No.', nzWidth: '150px'},
    {title: 'Tracking No.', nzWidth: '150px', key: 'trackingNo'},
    {title: 'Status', nzWidth: '100px', key: 'orderStatus'},
    {title: 'Recipient Name', nzWidth: '150px', key: 'recipientName'},
    {title: 'Recipient Address', nzWidth: '200px', key: 'recipientAddress'},
    {title: 'Weight', nzWidth: '100px', key: 'itemWeight'},
    {title: 'Created At', nzWidth: '130px', key: 'createdAt'},
    {title: 'Actions', nzWidth: '120px', nzRight: true},
  ];

  traceOrderVisible: boolean = false;
  orderInvoiceVisible: boolean = false;
  orderShippingLabelVisible: boolean = false;
  orderDetailVisible: boolean = false;
  selectedOrderNo: string;
  selectedOrder: CourierOrderModel;
  orderTypeConstant = OrderTypeConstant;

  constructor(private tableService: TableService,
              private subHandlingService: SubHandlingService,
              private shippingOrderService: ShippingOrderService) {
  }

  ngOnInit(): void {
    this.getShippingOrder();
  }

  getShippingOrder(): void {
    this.dataLoading = true;
    this.subHandlingService.subscribe(
      this.shippingOrderService.findAll().pipe(
        tap((response: IResponse<ShippingOrderModel>) => {
          this.oriData = deepCopy(response.data);
          this.displayData = this.oriData.allOrder;
          this.pendingList = response.data.pendingList;
          this.inProgressList = response.data.inProgressList;
          this.pickedUpList = response.data.pickedUpList;
          this.completedList = response.data.completedList;
          this.failedList = response.data.failedList;
          this.dataLoading = false;
        })
      )
    )
  }

  search(event): void {
    if (event.target.value) {
      this.getCurrentTabData();
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.getCurrentTabData();
    }
  }

  sort(sortAttribute) {
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

  onClickView(data): void {
    this.selectedOrder = data;
    this.orderDetailVisible = true;
  }

  closeView(): void {
    this.orderDetailVisible = false;
  }

  onClickTrace(data: CourierOrderModel): void {
    this.selectedOrderNo = data.orderNo;
    this.traceOrderVisible = true;
  }

  closeTraceOrder(): void {
    this.traceOrderVisible = false;
  }

  onClickInvoice(orderNo): void {
    this.selectedOrderNo = orderNo;
    this.orderInvoiceVisible = true;
  }

  closeInvoice(): void {
    this.orderInvoiceVisible = false;
  }

  downloadInvoice(): void {
    this.invoiceComponent.savePDF();
  }

  onClickShippingLabel(orderNo): void {
    this.selectedOrderNo = orderNo;
    this.orderShippingLabelVisible = true;
  }

  closeShippingLabel(): void {
    this.orderShippingLabelVisible = false;
  }

  printShippingLabel(): void {
    this.shipmentLabelComponent.openPDF();
  }

  selectTab(event): void {
    this.tabCurrentIndex = event.index;
    this.getCurrentTabData();
  }

  getCurrentTabData(): void {
    switch (this.tabCurrentIndex) {
      case 0:
        this.displayData = deepCopy(this.oriData.allOrder);
        break;
      case 1:
        this.displayData = deepCopy(this.oriData.pendingList);
        break;
      case 2:
        this.displayData = deepCopy(this.oriData.inProgressList);
        break;
      case 3:
        this.displayData = deepCopy(this.oriData.pickedUpList);
        break;
      case 4:
        this.displayData = deepCopy(this.oriData.completedList);
        break;
      case 5:
        this.displayData = deepCopy(this.oriData.failedList);
        break;
    }

  }

}
