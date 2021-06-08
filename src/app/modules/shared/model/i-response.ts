export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: number;
  errorContextMap: any;
}
