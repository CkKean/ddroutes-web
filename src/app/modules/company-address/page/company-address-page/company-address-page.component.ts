import {Component, OnInit, ViewChild} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {CompanyAddressService} from "../../service/company-address.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {deepCopy} from "../../../shared/utils/common.util";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {CompanyAddressFormComponent} from "../../component/company-address-form/company-address-form.component";

@Component({
  templateUrl: './company-address-page.component.html',
  styleUrls: ['./company-address-page.component.scss'],
  providers: [SubHandlingService]
})
export class CompanyAddressPageComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;


  @ViewChild('addForm') addAddressFormComponent: CompanyAddressFormComponent
  @ViewChild('editForm') editAddressFormComponent: CompanyAddressFormComponent

  oriData: CompanyAddressModel[] = [];
  displayData: CompanyAddressModel[] = [];
  companyAddressData: CompanyAddressModel;
  companyAddressLoading: boolean = false;
  formLoading: boolean = false;
  deleteLoading: boolean = false;
  isAddVisible: boolean = false;
  isEditVisible: boolean = false;

  tableHeader = [
    {title: 'No.', nzWidth: '60px', key: 'id'},
    {title: 'Address', nzWidth: '150px', key: 'address'},
    {title: 'Postcode', nzWidth: '150px', key: 'postcode'},
    {title: 'City', nzWidth: '150px', key: 'city'},
    {title: 'State', nzWidth: '150px', key: 'state'},
    {title: 'Latitude', nzWidth: '150px', key: 'latitude'},
    {title: 'Longitude', nzWidth: '150px', key: 'longitude'},
    {title: 'Actions', nzWidth: '120px'},
  ];

  constructor(private tableService: TableService,
              private companyAddressService: CompanyAddressService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService, private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getAllCompanyAddress();

  }

  getAllCompanyAddress(): void {
    this.companyAddressLoading = true;
    this.subHandlingService.subscribe(
      this.companyAddressService.findAll().pipe(
        tap((response: IResponse<CompanyAddressModel[]>) => {
          if (response.success) {
            this.oriData = response.data;
            this.displayData = deepCopy(response.data);
            this.companyAddressLoading = false;
            this.formLoading = false;
          }
        })
      )
    )
  }

  onClickAdd(): void {
    this.isAddVisible = true;
  }

  onCancelAdd(): void {
    this.isAddVisible = false;
    this.addAddressFormComponent.clearForm();

  }

  submitAdd(): void {
    this.formLoading = true;
    this.addAddressFormComponent.submitAdd();
  }

  onClickDelete(data: CompanyAddressModel): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this company address record?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deleteCompanyAddress(data.id);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deleteCompanyAddress(id: number): void {
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.companyAddressService.delete(id).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.getAllCompanyAddress();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
  }

  onClickEdit(data: CompanyAddressModel): void {
    this.companyAddressData = data;
    this.isEditVisible = true;
  }

  onCancelEdit(): void {
    this.isEditVisible = false;
    this.editAddressFormComponent.clearForm();
  }

  submitEdit(): void {
    this.formLoading = true;
    this.editAddressFormComponent.submitEdit();
  }

  afterSubmitSuccess(): void {
    this.getAllCompanyAddress();
    this.isEditVisible = false;
    this.isAddVisible = false;
  }

  search(event): void {
    if (event.target.value) {
      this.displayData = deepCopy(this.oriData);
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.displayData = deepCopy(this.oriData);
    }
  }

  sort(sortAttribute) {
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

}
