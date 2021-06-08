import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

  @Input() title: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
