import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormGroup} from "@angular/forms";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../../shared/services/modal.service";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";
import {UtilityModel} from "../../../shared/model/utility.model";
import {takeUntil, tap} from "rxjs/operators";
import {CourierOrderService} from "../../service/courier-order.service";
import {CourierOrderRestService} from "../../service/courier-order.rest.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {IResponse} from "../../../shared/model/i-response";
import {ListOfOrderType} from "../../../../constant/courier-order.constant";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {ListOfPaymentMethod} from "../../../../constant/payment-method.constant";

@Component({
  templateUrl: './update-courier-order.component.html',
  styleUrls: ['./update-courier-order.component.scss'],
  providers: [SubHandlingService]
})
export class UpdateCourierOrderComponent extends BaseComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  courierOrderNoParam: string;
  courierOrderData: CourierOrderModel;
  courierOrderDataLoading: boolean = false;
  getShippingCostLoading: boolean = false;

  updateFormLoading: boolean = false;
  submitDisabled: boolean = true;
  courierOrderForm: FormGroup;

  stateList: UtilityModel[];
  listOfOrderType = ListOfOrderType;

  vehicleTypeList: string[];
  vehicleLoading: boolean = false;
  listOfPaymentMethod = ListOfPaymentMethod;
  overviewVisible: boolean = false;

  constructor(private courierOrderService: CourierOrderService,
              private courierOrderRestService: CourierOrderRestService,
              private subHandlingService: SubHandlingService,
              private router: Router, private route: ActivatedRoute,
              private modal: ModalService, private utilityService: UtilityService) {
    super();
  }

  ngOnInit(): void {
    this.courierOrderDataLoading = true;
    if (this.route.snapshot.queryParams) {
      this.courierOrderNoParam = this.route.snapshot.queryParams['orderNo'];
      this.initForm();
      this.stateList = this.utilityService.getState();
      this.getVehicleList();
      this.getCourierOrderInfo();
    } else {
      this.modal.promptWarningModal('Courier order does not exist.', null, 'OK', RoutesConstant.COURIER_ORDER);
    }
  }

  initForm(): void {
    this.courierOrderForm = this.courierOrderService.initForm(true, 0);
  }

  getVehicleList(): void {
    this.vehicleLoading = true;
    this.subHandlingService.subscribe(
      this.courierOrderRestService.getVehicleType().pipe(
        tap((response: IResponse<string[]>) => {
          if (response.success) {
            this.vehicleTypeList = response.data;
            this.vehicleLoading = false;
          }
        })
      )
    )
  }

  getCourierOrderInfo(): void {
    this.subHandlingService.subscribe(
      this.courierOrderRestService.findByOrderNo(this.courierOrderNoParam).pipe(
        tap((response: IResponse<CourierOrderModel>) => {
          if (response.success) {
            if (response.data.orderStatus === 'Pending' || response.data.pickupOrderStatus === 'Pending') {
              this.courierOrderData = response.data;
              this.patchValueIntoForm();
            } else {
              this.modal.promptWarningModal('Courier order cannot be edit because it was ' + (response.data.orderStatus ? response.data.orderStatus.toLowerCase() : response.data.pickupOrderStatus.toLowerCase()), null, 'OK', RoutesConstant.COURIER_ORDER);
            }
          } else {
            this.modal.promptWarningModal('Courier order does not exist.', null, 'OK', RoutesConstant.COURIER_ORDER);
          }
        })
      )
    );
  }

  patchValueIntoForm(): void {
    this.courierOrderForm.patchValue(this.courierOrderData);
    this.subscribeForm();
  }

  cancelForm(): void {
    this.patchValueIntoForm();
    this.submitDisabled = true;
  }

  onSubmitForm(): void {
    markFormGroupTouched(this.courierOrderForm);
    getInvalidControls(this.courierOrderForm);
    if (this.courierOrderForm.invalid) {
      return;
    }

    this.courierOrderForm.disable();
    this.fullSenderAddress.patchValue(this.senderAddress.value + ', ' + this.senderPostcode.value + ' ' + this.senderCity.value + ', ' + this.senderState.value);
    this.fullRecipientAddress.patchValue(this.recipientAddress.value + ', ' + this.recipientPostcode.value + ' ' + this.recipientCity.value + ', ' + this.recipientState.value);

    let courierOrder: CourierOrderModel = this.courierOrderForm.getRawValue();
    this.getShippingCostLoading = true;

    this.subHandlingService.subscribe(
      this.courierOrderRestService.getShippingCost(courierOrder).pipe(
        tap((response: IResponse<number>) => {
          if (response.success) {
            this.shippingCost.patchValue(response.data);
            this.overviewVisible = true;
          }
          this.getShippingCostLoading = false;

        })
      )
    )
  }

  submitForm(): void {
    markFormGroupTouched(this.courierOrderForm);
    getInvalidControls(this.courierOrderForm);
    if (this.courierOrderForm.invalid) {
      return;
    }

    let courierOrder: CourierOrderModel = this.courierOrderForm.getRawValue();
    courierOrder.orderNo = this.courierOrderData.orderNo;
    courierOrder.orderId = this.courierOrderData.orderId;

    this.updateFormLoading = true;
    this.subHandlingService.subscribe(
      this.courierOrderRestService.updateCourierOrder(courierOrder).pipe(
        tap((response: any) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, null, RoutesConstant.COURIER_ORDER);
          } else {
            this.modal.promptErrorModal(response.message, null, null);
          }
          this.updateFormLoading = false;
        })
      )
    )
  }

  subscribeForm(): void {
    this.courierOrderForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (JSON.stringify(this.courierOrderData) !== JSON.stringify(value)) {
        this.submitDisabled = false;
      } else {
        this.submitDisabled = true;
      }
    });
  }

  cancelOverview(): void {
    this.overviewVisible = false;
    this.courierOrderForm.enable();
  }

  get orderType(): AbstractControl {
    return this.courierOrderForm.get('orderType');
  }

  get senderName(): AbstractControl {
    return this.courierOrderForm.get('senderName');
  }

  get senderMobileNo(): AbstractControl {
    return this.courierOrderForm.get('senderMobileNo');
  }

  get senderEmail(): AbstractControl {
    return this.courierOrderForm.get('senderEmail');
  }

  get senderAddress(): AbstractControl {
    return this.courierOrderForm.get('senderAddress');
  }

  get senderCity(): AbstractControl {
    return this.courierOrderForm.get('senderCity');
  }

  get senderState(): AbstractControl {
    return this.courierOrderForm.get('senderState');
  }

  get senderPostcode(): AbstractControl {
    return this.courierOrderForm.get('senderPostcode');
  }

  get recipientName(): AbstractControl {
    return this.courierOrderForm.get('recipientName');
  }

  get recipientMobileNo(): AbstractControl {
    return this.courierOrderForm.get('recipientMobileNo');
  }

  get recipientEmail(): AbstractControl {
    return this.courierOrderForm.get('recipientEmail');
  }

  get recipientAddress(): AbstractControl {
    return this.courierOrderForm.get('recipientAddress');
  }

  get recipientCity(): AbstractControl {
    return this.courierOrderForm.get('recipientCity');
  }

  get recipientState(): AbstractControl {
    return this.courierOrderForm.get('recipientState');
  }

  get recipientPostcode(): AbstractControl {
    return this.courierOrderForm.get('recipientPostcode');
  }

  get itemQty(): AbstractControl {
    return this.courierOrderForm.get('itemQty');
  }

  get itemType(): AbstractControl {
    return this.courierOrderForm.get('itemType');
  }

  get itemWeight(): AbstractControl {
    return this.courierOrderForm.get('itemWeight');
  }

  get shippingCost(): AbstractControl {
    return this.courierOrderForm.get('shippingCost');
  }

  get paymentMethod(): AbstractControl {
    return this.courierOrderForm.get('paymentMethod');
  }

  get vehicleType(): AbstractControl {
    return this.courierOrderForm.get('vehicleType');
  }

  get fullSenderAddress(): AbstractControl {
    return this.courierOrderForm.get('fullSenderAddress');
  }

  get fullRecipientAddress(): AbstractControl {
    return this.courierOrderForm.get('fullRecipientAddress');
  }

}
