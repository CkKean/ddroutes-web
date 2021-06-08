import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../component/shared-modal-content/shared-modal-content.component";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ModalService {
  constructor(private modal: NzModalService, private router: Router) {
  }

  promptWarningModal(subTitle: string, cancelText?: string, confirmText?: string, route?: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Failed',
        subtitle: subTitle,
        status: 'warning',
        cancelText: cancelText ? cancelText : 'Cancel',
        confirmText: confirmText ? confirmText : 'Confirm',
        nzOnOk: () => {
          modal.close();
          if (route) {
            this.router.navigate([route]);
          }
        },
        nzOnCancel: cancelText ? () => {
          modal.close();
        } : null
      },
      nzOnCancel: () => {
        modal.close();
        if (route) {
          this.router.navigate([route]);
        }
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  promptSuccessModal(subTitle: string, cancelText?: string, confirmText?: string, route?: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Success',
        subtitle: subTitle,
        status: 'success',
        confirmText: 'OK',
        nzOnOk: () => {
          modal.close();
          if (route)
            this.router.navigate([route]);
        }
      },
      nzOnCancel: () => {
        modal.close();
        if (route)
          this.router.navigate([route]);
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  promptErrorModal(subTitle: string, cancelText?: string, confirmText?: string, route?: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Failed',
        subtitle: subTitle,
        status: 'error',
        confirmText: 'OK',
        nzOnOk: () => {
          modal.close();
          if (route)
            this.router.navigate([route]);
        }
      },
      nzOnCancel: () => {
        modal.close();
        if (route)
          this.router.navigate([route]);
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  promptInfoModal(subTitle: string, cancelText?: string, confirmText?: string, route?: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Info',
        subtitle: subTitle,
        status: 'info',
        confirmText: 'OK',
        nzOnOk: () => {
          modal.close();
          if (route)
            this.router.navigate([route]);
        },
        nzOnCancel: cancelText ? () => {
          modal.close();
        } : null
      },
      nzOnCancel: () => {
        modal.close();
        if (route)
          this.router.navigate([route]);
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  promptCancelModal(module: string, route?: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: ' Are your sure you want to cancel this ' + module + ' Creation?\n' +
          '  This action cannot be undone.',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          if (route)
            this.router.navigate([route]);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }
}
