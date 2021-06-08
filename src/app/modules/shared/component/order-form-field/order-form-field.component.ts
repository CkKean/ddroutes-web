import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-order-form-field',
  templateUrl: './order-form-field.component.html',
  styleUrls: ['./order-form-field.component.scss']
})
export class OrderFormFieldComponent implements OnInit {

  @Input() label: string;
  @Input() align: string = 'middle';
  @Input() justify: string = 'start';
  @Input() fColLg: string = '24';
  @Input() fColMd: string = '24';
  @Input() sColLg: string = '24';
  @Input() sColMd: string = '24';
  @Input() required: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
