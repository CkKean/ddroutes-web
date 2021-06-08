import {Injectable} from "@angular/core";
import {formatDate} from "@angular/common";
import {deepCopy} from "../utils/common.util";

@Injectable({
  providedIn: "root"
})
export class TableService {
  constructor() {
  }

  /**
   * sort array via single
   * @param sortAttribute {key: property of the object, value: 'ascend' or 'descend'}
   * @param inputData
   */
  sort(sortAttribute: { key: string, value: string }, inputData: any[]) {
    const dataArr = deepCopy(inputData);
    if (sortAttribute.key === '' || sortAttribute.value === null) {
      return dataArr;
    }

    let outputDataList = dataArr.sort((a, b) => {
      const isAsc = sortAttribute.value === 'ascend';
      switch (sortAttribute.key) {
        case sortAttribute.key:
          return this.compare(typeof this.resolve(sortAttribute.key, a) !== "string" ? this.resolve(sortAttribute.key, a) : this.resolve(sortAttribute.key, a).toUpperCase(),
            typeof this.resolve(sortAttribute.key, b) !== "string" ? this.resolve(sortAttribute.key, b) : this.resolve(sortAttribute.key, b).toUpperCase(), isAsc);
        default:
          return 0;
      }
    });
    return outputDataList;
  }

  /**
   * Wild card search on all property of the object
   * @param input
   * @param inputData
   */
  search(input: any, inputData: any[]) {
    const searchText = (item) => {
      for (let key in item) {
        if (item[key] == null) {
          continue;
        }

        if (typeof item[key] == 'number' && item[key] != 0) {
          let date = formatDate(item[key], 'dd-MM-yyyy HH:mm:ss', 'en');
          if (date.indexOf(input.toString()) !== -1) {
            return true;
          }
          continue;
        }

        if (item[key].toString().toUpperCase().indexOf(input.toString().toUpperCase()) !== -1) {
          return true;
        }
      }
    };
    inputData = inputData.filter(value => searchText(value));
    return inputData;
  }

  /**
   * https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
   * @param path
   * @param obj
   * @param separator
   */
  resolve(path, obj = self, separator = '.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
  }

  /**
   * if isAsc is true
   * a > b    = 1
   * a === b  = 0
   * a < b    = -1
   *
   * if isAsc is false
   * a > b    = -1
   * a === b  = 0
   * a < b    = 1
   *
   * @param a
   * @param b
   * @param isAsc
   */
  private compare(a, b, isAsc: boolean) {
    // null value is - (dash)
    if (!a && a != 0) a = '-';
    if (!b && b != 0) b = '-';

    // whole number is date
    // if (typeof a == 'number' && a % 1 == 0) a = formatDate(a, 'yyyy-MM-dd HH:mm:ss', 'en');
    // if (typeof b == 'number' && b % 1 == 0) b = formatDate(b, 'yyyy-MM-dd HH:mm:ss', 'en');

    if (a === b) return 0;

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
