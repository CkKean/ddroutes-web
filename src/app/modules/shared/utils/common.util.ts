import {Injectable} from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';


@Injectable({
  providedIn: 'root',
})
export class CommonUtil {
  constructor() {
  }


  public pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}

export function deepCopy(object: any | any[]) {
  return cloneDeep(object);
}
