import {FormControl, FormGroup, Validators} from "@angular/forms";
import {noWhitespaceValidator, postCodeValidator} from "../../shared/validators/customvalidator.validator";
import {ListOfOrderType} from "../../../constant/courier-order.constant";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CourierOrderService {
  listOfOrderType = ListOfOrderType;

  constructor() {
  }

  initForm(disabled?: boolean, orderType?: number): FormGroup {
    return new FormGroup({
      orderType: new FormControl({value: this.listOfOrderType[orderType], disabled: disabled}, [Validators.required]),
      senderName: new FormControl(null, [Validators.required]),
      senderMobileNo: new FormControl(null, [Validators.required]),
      senderEmail: new FormControl(null),
      senderAddress: new FormControl(null, [Validators.required]),
      senderCity: new FormControl(null, [Validators.required]),
      senderState: new FormControl(null, [Validators.required]),
      senderPostcode: new FormControl(null, [Validators.required, postCodeValidator]),
      fullSenderAddress: new FormControl(null),
      recipientName: new FormControl(null, [Validators.required]),
      recipientMobileNo: new FormControl(null, [Validators.required]),
      recipientEmail: new FormControl(null),
      recipientAddress: new FormControl(null, [Validators.required]),
      recipientCity: new FormControl(null, [Validators.required]),
      recipientState: new FormControl(null, [Validators.required]),
      recipientPostcode: new FormControl(null, [Validators.required, postCodeValidator]),
      fullRecipientAddress: new FormControl(null),
      itemQty: new FormControl(null, [Validators.required]),
      itemType: new FormControl(null, [Validators.required]),
      itemWeight: new FormControl(null, [Validators.required]),
      shippingCost: new FormControl(null),
      paymentMethod: new FormControl(null, [Validators.required]),
      vehicleType: new FormControl(null, [Validators.required])
    })
  }
}
