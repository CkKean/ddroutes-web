import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../shared-modal-content/shared-modal-content.component";
import {DismissSessionTimeoutModal} from "../../../core/state/modal.action";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select, Store} from "@ngxs/store";
import {ModalState} from "../../../core/state/modal.state";
import {Observable} from "rxjs/internal/Observable";
import {Router} from "@angular/router";
import {ClearAuthState} from "../../../core/state/auth.action";

@Component({
  selector: 'app-sessionn-timeout-modal',
  templateUrl: './sessionn-timeout-modal.component.html',
  styleUrls: ['./sessionn-timeout-modal.component.scss']
})
export class SessionnTimeoutModalComponent implements OnInit {

  @Select(ModalState.isShowSessionTimeoutModal) isShowModal$: Observable<boolean>;

  constructor(private modal: NzModalService, private router: Router, private store: Store) {
  }

  ngOnInit(): void {
    this.isShowModal$.subscribe(value => {
      if (value) {
        this.promptModal();
      }
    });
  }

  promptModal(): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Error',
        subtitle: "Sorry, your session has expired. Please sign in again.!",
        status: 'error',
        confirmText: 'OK',
        nzOnOk: () => {
          this.store.dispatch(new ClearAuthState());
          this.store.dispatch(new DismissSessionTimeoutModal());
          this.router.navigate([RoutesConstant.LOGIN]).then();
          modal.close();
        }
      },
      nzOnCancel: () => {
        this.store.dispatch(new ClearAuthState());
        this.store.dispatch(new DismissSessionTimeoutModal());
        this.router.navigate([RoutesConstant.LOGIN]).then();
        modal.close();
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

}
