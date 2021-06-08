import {environment} from "../../environments/environment";

export class ApiRoutesConstant {
  public static BASE_URL = environment.apiUrl;

  public static AUTH = '/auth';
  public static SIGNIN = '/signin';
  public static SIGNUP = '/signup';
  public static VERIFY = '/verify';
  public static USERNAME = '/username';
  public static EMAIL = '/email';
  public static REFRESH_TOKEN = '/refresh-token';
  public static LOGOUT = '/logout';
  public static FIND = '/find';
  public static CREATE = '/create';
  public static UPDATE = '/update';
  public static DELETE = '/delete';
  public static ALL = '/all';
  public static STATUS = '/status';
  public static PUBLIC = '/public';

  // Utility
  public static UTILITY = '/utility';
  public static STATE = '/state';
  public static RELIGION = '/religion';
  public static RACE = '/race';
  public static CAR_BRAND = '/car-brand';
  public static MOTORCYCLE_BRAND = '/motorcycle-brand';

  // User
  public static USER = '/user';
  public static FIND_ALL = '/find-all';
  public static POSITION = '/position';

  // Vehicle
  public static VEHICLE = '/vehicle';
  public static FIND_ALL_VEHICLE_STAFF = '/find-all-vehicle-staff';
  public static TYPE = '/type';

  // Price Plan
  public static PRICE_PLAN = '/price-plan';

  // Courier Order
  public static COURIER_ORDER = '/courier-order';
  public static ORDER_NO = '/orderNo';
  public static ORDER_ID = '/orderID';
  public static TRACKING_NO = '/trackingNo';
  public static ORDER_STATUS = '/order/status';
  public static SHIPPING_COST = '/shipping-cost';

  // Route Order Report
  public static ORDER_ROUTE_REPORT = '/route-report';

  // Order Route
  public static ORDER_ROUTE = '/order-route';
  public static COURIER_PERSONNEL = '/courier-personnel';
  public static OPTIMIZE = '/optimize';
  public static AUTO = '/auto';
  public static MANUAL = '/manual';
  public static ADD_ORDER = '/add-order';
  public static VEHICLE_PERSONNEL = '/vehicle-personnel';


  // Tracking
  public static TRACKING = '/tracking';

  // Shipping Order
  public static SHIPPING_ORDER = '/shipping-order';

  //  Company Address
  public static COMPANY_ADDRESS = '/company-address';

  // Image Path
  public static IMAGE_API = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.PUBLIC;

  // Dashboard
  public static DASHBOARD = '/dashboard';
}
