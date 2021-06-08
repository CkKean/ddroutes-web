import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {CourierOrderRestService} from "../../service/courier-order.rest.service";
import {ShipmentLabelComponent} from "../../../shared/component/shipment-label/shipment-label.component";
import {InvoiceComponent} from "../../../shared/component/invoice/invoice.component";
import {OrderStatusModel} from "../../../shared/model/courier-order/order-status.model";
import {ListOfOrderStatus, OrderTypeConstant} from "../../../../constant/courier-order.constant";

@Component({
  selector: 'app-courier-order-table',
  templateUrl: './courier-order-table.component.html',
  styleUrls: ['./courier-order-table.component.scss'],
  providers: [SubHandlingService]
})
export class CourierOrderTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set courierOrderList(data: CourierOrderModel[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() orderLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(ShipmentLabelComponent) shipmentLabelComponent: ShipmentLabelComponent;
  @ViewChild(InvoiceComponent) invoiceComponent: InvoiceComponent;

  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];

  deleteLoading: boolean = false;
  traceOrderVisible: boolean = false;
  orderInvoiceVisible: boolean = false;
  orderShippingLabelVisible: boolean = false;
  selectedOrderId: string;
  selectedOrderNo: string;
  orderDetailLoading: boolean = false;
  orderStatus: OrderStatusModel;
  step: number;
  pageIndex: number;
  orderTypeConstant = OrderTypeConstant;


  tableHeader = [
    {title: 'No.', nzWidth: '60px'},
    {title: 'Order No.', nzWidth: '170px'},
    {title: 'Tracking No.', nzWidth: '170px', key: 'trackingNo'},
    {title: 'Type', nzWidth: '120px', key: 'orderType'},
    {title: 'Status', nzWidth: '150px', key: 'orderStatus'},
    {title: 'Recipient Name', nzWidth: '150px', key: 'recipientName'},
    {title: 'Weight (kg)', nzWidth: '120px', key: 'itemWeight'},
    {title: 'Created At', nzWidth: '170px', key: 'createdAt'},
    {title: 'Actions', nzWidth: '180px'},
  ];

  constructor(private tableService: TableService,
              private courierOrderService: CourierOrderRestService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService,
              private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  search(event): void {
    if (event.target.value) {
      this.displayData = deepCopy(this.oriData);
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.displayData = deepCopy(this.oriData);
    }
  }

  sort(sortAttribute) {
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

  onDeleteOrder(data: CourierOrderModel): void {

    if (data.orderStatus !== ListOfOrderStatus.PENDING && data.pickupOrderStatus !== ListOfOrderStatus.PENDING) {
      this.modal.promptWarningModal('Courier order cannot be deleted because it was ' + (data.orderStatus ? data.orderStatus.toLowerCase() : data.pickupOrderStatus.toLowerCase()), null, 'OK', RoutesConstant.COURIER_ORDER);
      return;
    }

    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this courier order?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deleteOrder(data.orderNo);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deleteOrder(orderNo: string): void {
    let status: string;
    let subTitle: string;
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.courierOrderService.deleteCourierOrder(orderNo).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            status = 'success';
            subTitle = 'Delete successfully.'
            this.modal.promptSuccessModal(subTitle, null, 'OK');
            this.refreshTable.emit();
          } else {
            subTitle = response.message;
            this.modal.promptErrorModal(subTitle, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
  }

  pageIndexChange(event): void {
    this.pageIndex = event;
  }

  navigateView(data: CourierOrderModel): void {
    this.router.navigate([RoutesConstant.VIEW], {relativeTo: this.route, queryParams: {orderNo: data.orderNo}});
  }

  navigateEdit(data: CourierOrderModel): void {

    if (data.orderStatus !== ListOfOrderStatus.PENDING && data.pickupOrderStatus !== ListOfOrderStatus.PENDING) {
      this.modal.promptWarningModal('Courier order cannot be edited because it was ' + (data.orderStatus ? data.orderStatus.toLowerCase() : data.pickupOrderStatus.toLowerCase()), null, 'OK', RoutesConstant.COURIER_ORDER);
      return;
    }

    this.router.navigate([RoutesConstant.UPDATE], {relativeTo: this.route, queryParams: {orderNo: data.orderNo}});
  }

  navigateCreate(): void {
    this.router.navigate([RoutesConstant.CREATE], {relativeTo: this.route});
  }

  onClickTrace(data: CourierOrderModel): void {
    this.selectedOrderId = data.orderId;
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
}
