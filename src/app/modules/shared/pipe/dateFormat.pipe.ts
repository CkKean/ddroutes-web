import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'sDate'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any) {
    const datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy\nh:mm:ss a');
    return value;
  }
}
