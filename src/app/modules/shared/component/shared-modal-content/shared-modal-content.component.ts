import {Component, Input, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-shared-modal-content',
  templateUrl: './shared-modal-content.component.html',
  styleUrls: ['./shared-modal-content.component.scss']
})
export class SharedModalContentComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() status: string = 'success' || 'warning' || 'error' || 'info';
  @Input() cancelText: string = 'Cancel';
  @Input() confirmText: string = 'Confirm';
  @Input() nzOnOk: () => void;
  @Input() nzOnCancel: () => void;

  constructor() {
  }

  ngOnInit(): void {
  }

  handleCancel(): void {
    this.nzOnCancel();
  }

  handleSubmit(): void {
    this.nzOnOk();
  }

  get iconPath(): string {
    return './assets/icons/svg/';
  }

}
