import {Component, OnInit} from '@angular/core';
import {RoutesConstant} from "../../../../constant/routes.constant";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../../shared/services/modal.service";
import {RouteReportService} from "../../service/route-report.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {RouteReportModel} from "../../../shared/model/route-report/route-report.model";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {DateFormatPipe} from "../../../shared/pipe/dateFormat.pipe";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './view-route-report-page.component.html',
  styleUrls: ['./view-route-report-page.component.scss'],
  providers: [SubHandlingService, DateFormatPipe]
})
export class ViewRouteReportPageComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  routeReportId: string;
  routeReportLoading: boolean = false;
  routeReportData: RouteReportModel;
  deleteLoading: boolean = false;
  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];

  imageUrl: string;
  imageBase64: string;

  tableHeader = [
    {title: 'Order No.', nzWidth: '100px'},
    {title: 'Date', nzWidth: '100px', key: 'createdAt'},
    {title: 'Type', nzWidth: '100px', key: 'orderType'},
    {title: 'Status', nzWidth: '100px', key: 'displayOrderStatus'},
    {title: 'Name', nzWidth: '100px', key: 'recipientName'},
    {title: 'Address', nzWidth: '200px', key: 'recipientAddress'},
  ];

  printContent: any;
  routeConstant = RoutesConstant;

  constructor(private routeReportService: RouteReportService,
              private subHandlingService: SubHandlingService,
              private route: ActivatedRoute,
              private modal: ModalService,
              private router: Router,
              private nzModal: NzModalService,
              private tableService: TableService,
              private sDate: DateFormatPipe) {
  }

  ngOnInit(): void {
    this.routeReportLoading = true;
    if (this.route.snapshot.queryParams) {
      this.routeReportId = this.route.snapshot.queryParams['routeReportId'];
      this.getRouteReport();
    } else {
      this.modal.promptWarningModal('Route report does not exist.', null, 'OK', RoutesConstant.ORDER_ROUTE_REPORT);
    }
  }

  getRouteReport(): void {
    this.routeReportLoading = true;
    this.subHandlingService.subscribe(
      this.routeReportService.findOne(this.routeReportId).pipe(
        tap(async (response: IResponse<RouteReportModel>) => {
          if (response.success) {
            this.routeReportData = response.data;
            if (this.routeReportData.statementPath && this.routeReportData.statement)
              this.imageUrl = ApiRoutesConstant.IMAGE_API + this.routeReportData.statementPath + '/' + this.routeReportData.statement;
            this.routeReportLoading = false;
            await this.generatePDF();
          }

        })
      )
    )
  }

  editRouteReport(): void {
    this.router.navigate([RoutesConstant.ORDER_ROUTE_REPORT, RoutesConstant.UPDATE], {
      queryParamsHandling: "preserve"
    })
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  generatePdf() {
    pdfMake.createPdf(this.printContent).download(this.routeReportData.routeReportId + '.pdf');
  }

  onDeleteRouteReport(): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this order route report?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deleteRouteReport(this.routeReportId);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deleteRouteReport(routeReportId: string): void {
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.routeReportService.deleteRouteReport(routeReportId).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK', RoutesConstant.ORDER_ROUTE_REPORT);
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
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

  async generatePDF() {

    let body = [];
    body.push([{text: 'Order Information', style: 'tableHeader', colSpan: 7}, {}, {}, {}, {}, {}, {}]);
    let row = new Array();
    row.push({text: 'Order No.', style: 'tableHeader'});
    row.push({text: 'Date', style: 'tableHeader'});
    row.push({text: 'Type', style: 'tableHeader'});
    row.push({text: 'Name', style: 'tableHeader'});
    row.push({text: 'Address', style: 'tableHeader'});
    row.push({text: 'Postcode', style: 'tableHeader'});
    row.push({text: 'State', style: 'tableHeader'});
    body.push(row);

    this.routeReportData.orderList.forEach((order: CourierOrderModel) => {
      let row = new Array();
      row.push({text: order.orderNo}, {text: this.sDate.transform(order.createdAt)}, {text: order.orderType}, {text: order.recipientName}, {text: order.recipientAddress}, {text: order.recipientPostcode}, {text: order.recipientState});
      body.push(row);
    });

    this.printContent = {
      content: [
        {text: 'Order Route Report', style: 'header'},
        {
          style: 'tableExample',
          table: {
            widths: [150, '*'],
            body: [
              [
                {text: 'Order Information', style: 'tableHeader', colSpan: 2}, {}
              ],
              ['Report No.', this.routeReportId],
              ['Route Id', this.routeReportData?.orderRoute.routeId],
              ['Status', this.routeReportData?.orderRoute?.status],
              ['Total Item(s)', this.routeReportData?.totalItemsQty],
              ['Personnel', this.routeReportData?.orderRoute?.personnelInfo.fullName],
              ['Completed At', (this.routeReportData?.orderRoute?.status === 'Completed') ? this.routeReportData?.orderRoute?.updatedAt : '-'],
              ['Created By', this.routeReportData?.orderRoute?.createdByInfo?.fullName],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [150, '*'],
            body: [
              [
                {text: 'Vehicle Information', style: 'tableHeader', colSpan: 2}, {}
              ],
              ['Vehicle Type', this.routeReportData?.vehicleInfo.type],
              ['Plate Number', this.routeReportData?.vehicleInfo?.plateNo],
              ['Brand', this.routeReportData?.vehicleInfo.brand],
              ['Fuel Efficiency', this.routeReportData?.vehicleInfo.fuelEfficiency + ' ' + this.routeReportData?.vehicleInfo.fuelEfficiencyUnit],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [150, '*'],
            body: [
              [
                {text: 'Estimated Petrol Usage', style: 'tableHeader', colSpan: 2}, {}
              ],
              ['Distance Travel (km)', this.routeReportData?.calculatedDistanceTravel],
              ['Duration (min)', this.routeReportData?.orderRoute?.timeNeeded],
              ['Petrol Cost (RM)', this.routeReportData?.calculatedPetrolFees],
              ['Fuel Usage (L)', this.routeReportData?.calculatedPetrolUsage],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [150, '*'],
            body: [
              [
                {text: 'Actual Petrol Usage', style: 'tableHeader', colSpan: 2}, {}
              ],
              ['Petrol Cost (RM)', this.routeReportData?.actualPetrolFees],
              ['Latest Petrol Price(RM)', this.routeReportData?.latestPetrolPrice],
              ['Statement', this.imageUrl ? {
                image: await this.getBase64ImageFromURL(this.imageUrl),
                width: 150,
                height: 150,
              } : '-'],

            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [60, 60, 40, 80, 80, '*', '*'],
            body: body
          }
        }

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 20, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 20, 5]
        },
        tableExample: {
          margin: [0, 0, 30, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
      },
      defaultStyle: {
        alignment: 'justify',
        fontSize: 10,
      }
    }

  }

}
