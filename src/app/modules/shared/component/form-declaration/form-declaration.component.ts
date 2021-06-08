import {Component, Input, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-form-declaration',
  templateUrl: './form-declaration.component.html',
  styleUrls: ['./form-declaration.component.scss']
})
export class FormDeclarationComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() contentFirst: string = 'Please fill in the following fields.';
  @Input() contentSecond: string = 'Mandatory Fields';
  @Input() requiredSecondContent: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
