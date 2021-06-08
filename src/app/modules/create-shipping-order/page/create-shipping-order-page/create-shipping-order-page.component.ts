import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {Select, Store} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {PageValidModel, ShippingOrderState} from "../../state/shipping-order.state";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {ShippingOrderFormComponent} from "../../component/shipping-order-form/shipping-order-form.component";
import {Router} from "@angular/router";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {ResetShippingOrder} from "../../state/shipping-order.action";
import {PaymentComponent} from "../../component/payment/payment.component";
import {ShippingOrderService} from "../../../shipping-order/service/shipping-order.service";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {IResponse} from "../../../shared/model/i-response";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-create-shipping-order-page',
  templateUrl: './create-shipping-order-page.component.html',
  styleUrls: ['./create-shipping-order-page.component.scss'],
  providers: [SubHandlingService]
})
export class CreateShippingOrderPageComponent implements AfterViewChecked, OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Select(ShippingOrderState.getStep) step$: Observable<number>;
  @Select(ShippingOrderState.getPageValid) pageValid$: Observable<PageValidModel>;

  @ViewChild(ShippingOrderFormComponent) shippingOrderFormComponent: ShippingOrderFormComponent;
  @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

  step: number = 0;
  quotationData: any;
  orderData: CourierOrderModel;
  paymentMethod: string = null;
  submitLoading: boolean = false;

  constructor(private store: Store,
              private router: Router,
              private nzModal: NzModalService,
              private subHandlingService: SubHandlingService,
              private shippingOrderService: ShippingOrderService,
              private cdr: ChangeDetectorRef,
              private modal: ModalService,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(ResetShippingOrder);
    this.step$.pipe(distinctUntilChanged()).subscribe(value => {
      this.step = value;
    });
  }

  // ngAfterViewInit() {
  //   this.cdr.detectChanges();
  // }

  ngAfterViewChecked(){
    this.cdr.detectChanges();

  }

  onIndexChange(event: number): void {
    if (this.step === 1 && (event > this.step)) {
      if (!this.shippingOrderFormComponent.submitForm()) {
        return;
      }
    }
    this.step = event;
    this.changeStep();
  }

  back(): void {
    this.step -= 1;
    this.changeStep();
  }

  next(): void {
    if (this.step === 0) {
      this.orderData = this.store.selectSnapshot(ShippingOrderState.getOrder);
      this.step += 1;
    } else if (this.step === 1) {
      if (this.shippingOrderFormComponent.submitForm()) {
        this.step += 1;
      }
    } else if (this.step === 2) {
      this.paymentMethod = this.store.selectSnapshot(ShippingOrderState.getOrder).paymentMethod;
      this.step += 1;
    } else if (this.step === 3) {
      if (this.paymentComponent.submit()) {
        let order: CourierOrderModel = this.store.selectSnapshot(ShippingOrderState.getOrder);
        this.submitLoading = true;
        this.subHandlingService.subscribe(
          this.shippingOrderService.createShippingOrder(order).pipe(
            tap((response: IResponse<any>) => {
              if (response.success) {
                this.store.dispatch(new ResetShippingOrder());
                this.modal.promptSuccessModal(response.data, null, "OK", RoutesConstant.SHIPPING_ORDER);
              } else {
                this.modal.promptErrorModal(response.message, null, null);
              }
              this.submitLoading = false;
            })
          )
        )
      }
    }
  }

  changeStep(): void {
    if (this.step === 1) {
      this.orderData = this.store.selectSnapshot(ShippingOrderState.getOrder);
    } else if (this.step === 3) {
      this.paymentMethod = this.store.selectSnapshot(ShippingOrderState.getOrder).paymentMethod;
    }
  }

  cancelForm(): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: ' Are your sure you want to cancel this Shipping Order Creation?\n' +
          '  This action cannot be undone.',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.store.dispatch(ResetShippingOrder);
          this.router.navigate(['/']);
        },
        nzOnCancel: () => modal.close()
      },
      nzOnCancel: () => modal.close,
      nzCentered: true,
      nzFooter: null,
    });
  }

}
