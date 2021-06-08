import {AfterViewInit, Component, Input} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.icon.glyph';
import 'leaflet-textpath';

import {environment} from "../../../../../environments/environment";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {OrderTypeConstant} from "../../../../constant/courier-order.constant";

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements AfterViewInit {

  @Input() set selectedOrderRoute(data: OrderRouteModel) {
    if (data) {
      this.orderList = data.displayOrderList;
      this.departureAddress = data.departureAddress;
      this.roundTrip = data.roundTrip;
    }
  }

  orderList: CourierOrderModel[];
  departureAddress: CompanyAddressModel;
  roundTrip: boolean;
  wayPoints: any = [];

  private map: L.Map;

  constructor() {
  }

  ngAfterViewInit() {

    let rt = this.roundTrip;
    let companyAddress = this.departureAddress;
    let wayPointList = this.orderList;
    this.map = L.map('map', {
      center: [4.495218320278686, 101.01079889028111],
      zoom: 13,
      fullscreenControl: true,
    });

    let titleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.map.addLayer(titleLayer);

    this.wayPoints.push(new L.LatLng(+this.departureAddress.latitude, +this.departureAddress.longitude));
    for (let order of this.orderList) {
      let wayPoint = new L.LatLng(+order.recipientLatitude, +order.recipientLongitude);
      this.wayPoints.push(wayPoint);
    }

    if (this.roundTrip) {
      this.wayPoints.push(new L.LatLng(+this.departureAddress.latitude, +this.departureAddress.longitude));
    }

    let routeControl = L.Routing.control({
      show: false,
      collapsible: true,
      draggableWaypoints: false,
      waypoints: this.wayPoints,
      addWaypoints: false,
      router: L.Routing.mapbox(environment.mapbox.accessToken),
      plan: L.Routing.plan(this.wayPoints, {
        createMarker: function (i: number, waypoint: any, n: number) {

          let startIcon = './assets/img/markers/icon-home.png';
          let endIcon = './assets/img/markers/icon-finish.png';
          let startEndIcon = './assets/img/markers/icon-home-finish.png';
          let showIcon: string;
          if (rt) {
            if (i === 0 || i === n - 1) {
              showIcon = startEndIcon;
            }
          } else {
            if (i === 0) {
              showIcon = startIcon;
            }
            if (i === (n - 1)) {
              showIcon = endIcon;
            }
          }

          const homeMarker = L.marker(waypoint.latLng, {
            draggable: false,
            bounceOnAdd: false,
            bounceOnAddOptions: {
              duration: 1000,
              height: 800,
              function() {
              }
            },
            icon: L.icon({
              iconUrl: showIcon,
              iconSize: [32, 37],
              iconAnchor: [16, 37],
              popupAnchor: [-3, -40],
              shadowUrl: './assets/img/markers/marker-shadow.png',
              shadowSize: [33, 38],
              shadowAnchor: [16, 37]
            })
          });

          const wayPointMaker = L.marker(waypoint.latLng, {
            icon: L.icon.glyph({
              prefix: '',
              glyph: (i)

            }),
            draggable: false
          });

          let orderStatus: string;
          if (rt) {
            if (i === 0 || i === n - 1) {
              return homeMarker.bindPopup(
                "<div>Start & End</div>" +
                "<div>" + companyAddress.address + ', ' + companyAddress.postcode + ' ' + companyAddress.city + ', ' + companyAddress.state + ', Malaysia' + "</div>"
              );
            } else {
              if (wayPointList[i - 1].orderType === OrderTypeConstant.PICK_UP && !wayPointList[i - 1].isPickedUp) {
                orderStatus = wayPointList[i - 1].pickupOrderStatus;
              } else {
                orderStatus = wayPointList[i - 1].orderStatus;
              }
              const popupTemplate =
                "<div class='text-p6 font-weight-semibold'>" + wayPointList[i - 1].orderType + "</div>" +
                "<div class='text-p6 font-weight-normal'>" + orderStatus + "</div>" +
                "<div class='text-p6 font-weight-normal'>" + wayPointList[i - 1].recipientAddress + ', ' + wayPointList[i - 1].recipientPostcode + ' ' + wayPointList[i - 1].recipientCity + ', ' + wayPointList[i - 1].recipientState + ', Malaysia' + "</div>";

              return wayPointMaker.bindPopup(popupTemplate);

            }
          } else {
            if (i === 0) {
              return homeMarker.bindPopup(
                "<div>Start</div>" +
                "<div>" + companyAddress.address + ', ' + companyAddress.postcode + ' ' + companyAddress.city + ', ' + companyAddress.state + ', Malaysia' + "</div>");
            } else if (i === (n - 1)) {
              if (wayPointList[i - 1].orderType === OrderTypeConstant.PICK_UP && !wayPointList[i - 1].isPickedUp) {
                orderStatus = wayPointList[i - 1].pickupOrderStatus;
              } else {
                orderStatus = wayPointList[i - 1].orderStatus;
              }
              const popupTemplate =
                "<div>" + wayPointList[i - 1].orderType + "</div>" +
                "<div>" + orderStatus + "</div>" +
                "<div>" + wayPointList[i - 1].recipientAddress + ', ' + wayPointList[i - 1].recipientPostcode + ' ' + wayPointList[i - 1].recipientCity + ', ' + wayPointList[i - 1].recipientState + ', Malaysia' + "</div>";

              return homeMarker.bindPopup(popupTemplate);
            } else {
              if (wayPointList[i - 1].orderType === OrderTypeConstant.PICK_UP && !wayPointList[i - 1].isPickedUp) {
                orderStatus = wayPointList[i - 1].pickupOrderStatus;
              } else {
                orderStatus = wayPointList[i - 1].orderStatus;
              }
              const popupTemplate =
                "<div>" + wayPointList[i - 1].orderType + "</div>" +
                "<div>" + orderStatus + "</div>" +
                "<div>" + wayPointList[i - 1].recipientAddress + ', ' + wayPointList[i - 1].recipientPostcode + ' ' + wayPointList[i - 1].recipientCity + ', ' + wayPointList[i - 1].recipientState + ', Malaysia' + "</div>";

              return wayPointMaker.bindPopup(popupTemplate);
            }
          }
        }
      }),
      routeLine: function (route, i) {
        let line = L.polyline(route.coordinates, {
          multiOptions: {},
          weight: 5,
          lineCap: 'butt',
          opacity: 0.75,
          smoothFactor: 1
        });

        line.on('mouseover', function () {
          this.setText('  ►  ', {
            repeat: true,
            attributes: {
              fill: 'red'
            }
          });
        });
        line.on('mouseout', function () {
          this.setText(null);
        });
        return line;
      },
      lineOptions: {
        styles: [{className: 'animate'}] // Adding animate class
      },
    }).addTo(this.map);
  }
}
