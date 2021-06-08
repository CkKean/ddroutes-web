import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../shared-modal-content/shared-modal-content.component";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Router} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {Select, Store} from "@ngxs/store";
import {ModalState} from "../../../core/state/modal.state";
import {DismissAccessDeniedModal} from "../../../core/state/modal.action";

@Component({
  selector: 'app-access-denied-modal',
  templateUrl: './access-denied-modal.component.html',
  styleUrls: ['./access-denied-modal.component.scss']
})
export class AccessDeniedModalComponent implements OnInit {

  @Select(ModalState.isShowAccessDeniedModal) isShowModal$: Observable<boolean>;

  constructor(private modal: NzModalService, private router: Router, private store: Store) {
  }

  ngOnInit(): void {
    this.isShowModal$.subscribe(value => {
      if (value) {
        this.promptModal();
      }
    })
  }

  promptModal(): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Failed',
        subtitle: "Access denied!",
        status: 'error',
        confirmText: 'OK',
        nzOnOk: () => {
          this.store.dispatch(new DismissAccessDeniedModal());
          this.router.navigate([RoutesConstant.DASHBOARD]).then();
          modal.close();
        }
      },
      nzOnCancel: () => {
        this.store.dispatch(new DismissAccessDeniedModal());
        this.router.navigate([RoutesConstant.DASHBOARD]).then();
        modal.close();
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

}
