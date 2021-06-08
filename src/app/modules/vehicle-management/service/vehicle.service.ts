import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.VEHICLE;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findVehicleType() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.TYPE, {});
  }

  findAllVehicleStaff() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL_VEHICLE_STAFF, {});
  }

  findOne(plateNo: string) {
    const params = {plateNo: plateNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }

  createVehicle(formData: FormData) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, formData, {});
  }

  updateVehicle(formData: FormData) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, formData, {});
  }

  deleteVehicle(vehicleId: string) {
    const params = {vehicleId: vehicleId};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }

  checkDuplicateVehicle(plateNo: string) {
    const params = {plateNo: plateNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.VERIFY, {params: params});
  }

  uploadImage(formData: FormData) {
    // let headers = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // const httpOptions = {
    //   headers: headers
    // };
    return this.http.post<any>(this.baseUrl + '/upload-image', formData);
  }

  getImage(destination: string, fileName: string) {

    return this.http.get(ApiRoutesConstant.BASE_URL + ApiRoutesConstant.PUBLIC + '/image', {
      params: {
        destination: destination,
        fileName: fileName
      }, responseType: 'blob'
    })
  }
}
