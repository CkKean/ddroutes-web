import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {
  AllUtilities,
  CarBrandList,
  MotorcycleBrandList,
  RaceList,
  ReligionList,
  StateList
} from "../../../constant/utility.constant";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.UTILITY;

  constructor(private http: HttpClient) {
  }

  getState() {
    return StateList;
  }

  getRace() {
    return RaceList;
  }

  getReligion() {
    return ReligionList;
  }

  getCarBrand() {
    return CarBrandList;
  }

  getMotorCycleBrand() {
    return MotorcycleBrandList;
  }

  getAllUtilities() {
    return AllUtilities;
  }
}
