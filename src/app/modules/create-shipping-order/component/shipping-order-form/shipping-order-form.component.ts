import {Component, Input, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormGroup} from "@angular/forms";
import {UtilityModel} from "../../../shared/model/utility.model";
import {ListOfOrderType} from "../../../../constant/courier-order.constant";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {CourierOrderService} from "../../../courier-order/service/courier-order.service";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {tap} from "rxjs/operators";
import {SetFormStatus, SetOrder, SetPageValid, SetStep} from "../../state/shipping-order.action";
import {FormStatusModel, PageValidModel, ShippingOrderState} from "../../state/shipping-order.state";
import {IResponse} from "../../../shared/model/i-response";
import {ShippingOrderService} from "../../../shipping-order/service/shipping-order.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState} from 'src/app/modules/core/state/auth.state';
import {User} from "../../../shared/model/register/user.model";

@Component({
  selector: 'app-shipping-order-form',
  templateUrl: './shipping-order-form.component.html',
  styleUrls: ['./shipping-order-form.component.scss']
})
export class ShippingOrderFormComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @SelectSnapshot(AuthState.getUserInformation) userInformation: User;

  @Input() orderData: CourierOrderModel;

  courierOrderForm: FormGroup;
  addFormLoading: boolean = false;

  listOfOrderType = ListOfOrderType;
  stateList: UtilityModel[];
  vehicleTypeList: string[];
  vehicleLoading: boolean = false;

  overviewVisible: boolean = false;
  sameAddress: boolean = false;

  constructor(private utilityService: UtilityService,
              private subHandlingService: SubHandlingService,
              private courierOrderService: CourierOrderService,
              private store: Store,
              private shippingOrderService: ShippingOrderService) {
  }

  ngOnInit() {
    this.stateList = this.utilityService.getState();
    this.getVehicleList();
    this.initForm();
    this.store.dispatch(new SetStep({step: 1}));
    let pageValid: PageValidModel = this.store.selectSnapshot(ShippingOrderState.getPageValid);
    pageValid = {...pageValid, orderPageValid: true}
    this.store.dispatch(new SetPageValid({page: pageValid}));
  }

  initForm(): void {
    this.courierOrderForm = this.courierOrderService.initForm(true, 1);
    if (this.orderData) {
      this.courierOrderForm.patchValue(this.orderData);
    }
  }

  submitForm() {
    this.paymentMethod.patchValue("Cash");

    markFormGroupTouched(this.courierOrderForm);
    getInvalidControls(this.courierOrderForm);

    let formStatus: FormStatusModel = this.store.selectSnapshot(ShippingOrderState.getFormStatus);
    formStatus = {...formStatus, orderFormStatus: this.courierOrderForm.status};
    this.store.dispatch(new SetFormStatus({status: formStatus}));

    if (this.courierOrderForm.invalid) {
      return false;
    }
    let sAddress;
    let rAddress;

    if (this.senderAddress.value.slice(-1).match(',')) {
      sAddress = this.senderAddress.value.slice(0, -1);
      this.senderAddress.patchValue(sAddress);
    }
    if (this.recipientAddress.value.slice(-1).match(',')) {
      rAddress = this.recipientAddress.value.slice(0, -1);
      this.recipientAddress.patchValue(rAddress);
    }
    this.fullSenderAddress.patchValue( this.senderAddress.value + ', ' + this.senderPostcode.value + ' ' + this.senderCity.value + ', ' + this.senderState.value);
    this.fullRecipientAddress.patchValue(this.recipientAddress.value + ', ' + this.recipientPostcode.value + ' ' + this.recipientCity.value + ', ' + this.recipientState.value);

    let courierOrder: CourierOrderModel = this.courierOrderForm.getRawValue();
    this.store.dispatch(new SetOrder({order: courierOrder}));

    return true;
  }

  getVehicleList(): void {
    this.vehicleLoading = true;
    this.subHandlingService.subscribe(
      this.shippingOrderService.getVehicleType().pipe(
        tap((response: IResponse<string[]>) => {
          if (response.success) {
            this.vehicleTypeList = response.data;
            this.vehicleLoading = false;
          }
        })
      )
    )
  }

  onSameAddressChange(event): void {
    this.sameAddress = event;
    if (event) {
      this.patchSenderAddress();
    } else {
      this.clearSenderAddress();
    }
  }

  patchSenderAddress(): void {
    this.senderAddress.patchValue(this.userInformation?.address);
    this.senderPostcode.patchValue(this.userInformation?.postcode);
    this.senderCity.patchValue(this.userInformation?.city);
    this.senderState.patchValue(this.userInformation?.state);
  }

  clearSenderAddress(): void {
    this.senderAddress.patchValue(null);
    this.senderPostcode.patchValue(null);
    this.senderCity.patchValue(null);
    this.senderState.patchValue(null);
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
