import {Component, Input, OnInit} from '@angular/core';
import {ListOfOrderStatus} from "../../../../constant/courier-order.constant";

@Component({
  selector: 'app-label-tag',
  templateUrl: './label-tag.component.html',
  styleUrls: ['./label-tag.component.scss']
})
export class LabelTagComponent implements OnInit {

  @Input() set tagType(data: string) {
    this.status = data;
    if (data === ListOfOrderStatus.COMPLETED || data === ListOfOrderStatus.DELIVERED) {
      this.nzColor = 'green';
    } else if (data === ListOfOrderStatus.IN_PROGRESS) {
      this.nzColor = 'blue';
    } else if (data === ListOfOrderStatus.NOT_DELIVERED || data === ListOfOrderStatus.NOT_PICK_UP || data === ListOfOrderStatus.FAILED) {
      this.nzColor = 'red';
    } else if (data === ListOfOrderStatus.PICKED_UP) {
      this.nzColor = 'lime';
    } else if (data === ListOfOrderStatus.PENDING) {
      this.nzColor = 'orange';
    } else {
      this.nzColor = 'default';
    }
  }

  nzColor: string;
  status: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
