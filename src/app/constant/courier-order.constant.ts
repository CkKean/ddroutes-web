export const ListOfOrderType: string[] = [
  'Delivery',
  'Pick-Up',
];


export class OrderTypeConstant {
  public static DELIVERY: string = 'Delivery';
  public static PICK_UP: string = 'Pick-Up';
}

export class ListOfOrderStatus {
  public static PENDING = 'Pending';
  public static IN_PROGRESS = 'In Progress';
  public static COMPLETED = 'Completed';
  public static FAILED = 'Failed';

  public static NOT_DELIVERED = 'Not Delivered'; // Task Proof Status
  public static NOT_PICK_UP = 'Not Pick-up'; // Task Proof Status
  public static PICKED_UP = 'Picked Up';
  public static DELIVERED = 'Delivered';

}
