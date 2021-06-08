import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.html',
  styleUrls: ['./confirmation-modal.scss']
})
export class ConfirmationModal implements OnInit {

  @Input() visible: boolean = false;
  @Input() titleText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() confirmText: string = 'Confirm';
  @Input() status: string = 'success' || 'warning' || 'error' || 'info';
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

  get iconPath(): string {
    return './assets/icons/svg/';
  }
}
