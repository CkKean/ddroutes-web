import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})
export class SharedModalComponent implements OnInit {

  @Input() visible: boolean = false;
  @Input() titleText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() isCancelVisible: boolean = true;
  @Input() confirmText: string = 'Confirm';
  @Input() isConfirmVisible: boolean = true;
  @Input() modalWidth: string = '80vw';
  @Input() isCenter: boolean = true;
  @Input() submitLoading: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  handleCancel(): void {
    this.onClose.emit();
  }

  handleSubmit(): void {
    this.onSubmit.emit();
  }
}
