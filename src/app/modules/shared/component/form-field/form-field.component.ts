import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit {
  @Input() label: string;
  @Input() align: string = 'middle';
  @Input() justify: string = 'start';
  @Input() fColLg: string = '7';
  @Input() fColMd: string = '7';
  @Input() sColLg: string = '9';
  @Input() sColMd: string = '9';
  @Input() required: boolean = true;
  @Input() requiredDot: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
