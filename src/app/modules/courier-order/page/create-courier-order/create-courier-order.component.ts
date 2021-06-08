import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormGroup} from "@angular/forms";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {Router} from "@angular/router";
import {ModalService} from "../../../shared/services/modal.service";
import {CourierOrderRestService} from "../../service/courier-order.rest.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {tap} from "rxjs/operators";
import {UtilityModel} from "../../../shared/model/utility.model";
import {ListOfOrderType} from "../../../../constant/courier-order.constant";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {IResponse} from "../../../shared/model/i-response";
import {CourierOrderService} from "../../service/courier-order.service";
import {ListOfPaymentMethod} from "../../../../constant/payment-method.constant";

@Component({
  templateUrl: './create-courier-order.component.html',
  styleUrls: ['./create-courier-order.component.scss'],
  providers: [SubHandlingService]
})
export class CreateCourierOrderComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  courierOrderForm: FormGroup;
  addFormLoading: boolean = false;
  getShippingCostLoading: boolean = false;

  stateList: UtilityModel[];

  vehicleTypeList: string[];
  vehicleLoading: boolean = false;

  listOfOrderType = ListOfOrderType;
  listOfPaymentMethod = ListOfPaymentMethod;

  overviewVisible: boolean = false;

  constructor(private courierOrderRestService: CourierOrderRestService,
              private subHandlingService: SubHandlingService,
              private router: Router,
              private modal: ModalService,
              private utilityService: UtilityService,
              private courierOrderService: CourierOrderService) {
  }

  ngOnInit() {
    this.stateList = this.utilityService.getState();
    this.getVehicleList();
    this.initForm();
  }

  initForm(): void {
    this.courierOrderForm = this.courierOrderService.initForm(true, 0);
  }

  cancelForm(): void {
    this.modal.promptCancelModal('Courier Order', RoutesConstant.COURIER_ORDER);
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

  cancelOverview(): void {
    this.overviewVisible = false;
    this.courierOrderForm.enable();
  }

  submitForm(): void {
    markFormGroupTouched(this.courierOrderForm);
    getInvalidControls(this.courierOrderForm);
    if (this.courierOrderForm.invalid) {
      return;
    }
    let courierOrder: CourierOrderModel = this.courierOrderForm.getRawValue();
    courierOrder.recipientMobileNo = "60" + courierOrder.recipientMobileNo;
    courierOrder.senderMobileNo = "60" + courierOrder.senderMobileNo;
    this.addFormLoading = true;
    this.subHandlingService.subscribe(
      this.courierOrderRestService.createCourierOrder(courierOrder).pipe(
        tap((response: IResponse<any>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, null, RoutesConstant.COURIER_ORDER);
          } else {
            this.modal.promptErrorModal(response.message, null, null);
          }
          this.addFormLoading = false;
        })
      )
    )
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

  get fullSenderAddress(): AbstractControl {
    return this.courierOrderForm.get('fullSenderAddress');
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

  get fullRecipientAddress(): AbstractControl {
    return this.courierOrderForm.get('fullRecipientAddress');
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

}
