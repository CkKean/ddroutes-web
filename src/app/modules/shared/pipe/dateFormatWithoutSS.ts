import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'sDateWithoutSS'
})
export class DateFormatWithoutSS implements PipeTransform {
  transform(value: any) {
    const datePipe = new DatePipe("en-US");
    const oriValue = value;
    value = datePipe.transform(value, 'dd/MM/yyyy h:mm a');
    let afterAddHours = new Date((((new Date(oriValue)).getTime() / 1000) + 3600) * 1000);
    const valueWithin = datePipe.transform(afterAddHours, 'h:mm a');
    return value + ' - ' + valueWithin;
  }
}
