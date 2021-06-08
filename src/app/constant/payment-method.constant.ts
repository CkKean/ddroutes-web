export class PaymentMethodConstant {
  public static CASH: string = 'Cash';
  public static CREDIT_DEBIT: string = 'Credit/Debit Card';
  public static E_WALLET: string = 'E-Wallet';
  public static ONLINE_BANK: string = 'Online Bank';
};


export const ListOfPaymentMethod: string[] = [
  PaymentMethodConstant.CASH,
  PaymentMethodConstant.CREDIT_DEBIT,
  PaymentMethodConstant.E_WALLET,
  PaymentMethodConstant.ONLINE_BANK,
];
