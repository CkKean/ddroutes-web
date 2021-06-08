export class UserTypeConstant {
  public static SA = 0;
  public static S = 1;
  public static NU = 2;

  public static getUserType(userType: number): String {
    let type: String;
    if (userType === this.SA) {
      type = "Super Admin";
    } else if (userType === this.S) {
      type = "Staff";
    } else if (userType === this.NU) {
      type = "Normal User";
    }
    return type;
  }
}
