import {CourierOrderModel} from "../../shared/model/courier-order/courier-order.model";
import {FormStatusModel, PageValidModel} from "./shipping-order.state";

export class SetStep {
  public static type = '[ShippingOrderState] Set Shipping Order Step';

  constructor(public readonly payload: { step: number }) {
  }
}

export class SetOrder {
  public static type = '[ShippingOrderState] Set Shipping Order';

  constructor(public readonly payload: { order: CourierOrderModel }) {
  }
}

export class SetQuotationPageValid {
  public static type = '[ShippingOrderState] Set Quotation Page Valid';

  constructor(public readonly payload: { valid: boolean }) {
  }
}

export class SetQuotationFormStatus {
  public static type = '[ShippingOrderState] Set Quotation Form Status';

  constructor(public readonly payload: { status: string }) {
  }
}

export class SetQuotationForm {
  public static type = '[ShippingOrderState] Set Quotation Form';

  constructor(public readonly payload: { fromAddress: string, toAddress: string, weight: number }) {
  }
}

export class SetOrderPageValid {
  public static type = '[ShippingOrderState] Set OrderPage Valid';

  constructor(public readonly payload: { valid: boolean }) {
  }
}

export class SetOrderFormStatus {
  public static type = '[ShippingOrderState] Set Order Form Status';

  constructor(public readonly payload: { status: string }) {
  }
}

export class SetSummaryPageValid {
  public static type = '[ShippingOrderState] Set Summary Page Valid';

  constructor(public readonly payload: { valid: boolean }) {
  }
}

export class SetPaymentPageValid {
  public static type = '[ShippingOrderState] Set Payment Page Valid';

  constructor(public readonly payload: { valid: boolean }) {
  }
}

export class SetPaymentFormStatus {
  public static type = '[ShippingOrderState] Set Payment Page Status';

  constructor(public readonly payload: { status: string }) {
  }
}

export class SetCompletedPageValid {
  public static type = '[ShippingOrderState] Set Completed Page Valid';

  constructor(public readonly payload: { valid: boolean }) {
  }
}

export class ResetShippingOrder {
  public static type = '[ShippingOrderState] Reset Shipping Order';

  constructor() {
  }
}

export class SetPaymentMethod {
  public static type = '[ShippingOrderState] Set Payment Method';

  constructor(public readonly payload: { method: string }) {
  }
}

export class SetFormStatus {
  public static type = '[ShippingOrderState] Set Form Status';

  constructor(public readonly payload: { status: FormStatusModel }) {
  }
}

export class SetPageValid {
  public static type = '[ShippingOrderState] Set Page Valid';

  constructor(public readonly payload: { page: PageValidModel }) {
  }
}

