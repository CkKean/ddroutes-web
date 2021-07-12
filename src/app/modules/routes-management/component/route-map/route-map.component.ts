import {AfterViewInit, Component, Input} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.icon.glyph';
import 'leaflet-textpath';

import {environment} from "../../../../../environments/environment";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {ListOfOrderStatus} from "../../../../constant/courier-order.constant";
import {DateFormatPipe} from "../../../shared/pipe/dateFormat.pipe";

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  providers: [DateFormatPipe]
})
export class RouteMapComponent implements AfterViewInit {

  @Input() set selectedOrderRoute(data: OrderRouteModel) {
    if (data) {
      this.orderList = data.displayOrderList;
      this.departureAddress = data.departureAddress;
      this.roundTrip = data.roundTrip;
      this.orderRoute = data;
    }
  }

  orderList: CourierOrderModel[];
  departureAddress: CompanyAddressModel;
  roundTrip: boolean;
  wayPoints: L.LatLng[] = [];
  orderRoute: OrderRouteModel;

  private map: L.Map;

  constructor(private sDate: DateFormatPipe) {
  }

  ngAfterViewInit() {

    let x0, x1, y0, y1;

    let routeTimeList: number[] = [];

    this.wayPoints.push(new L.LatLng(+this.departureAddress.latitude, +this.departureAddress.longitude));
    for (let order of this.orderList) {
      let wayPoint = new L.LatLng(+order.recipientLatitude, +order.recipientLongitude);
      this.wayPoints.push(wayPoint);
    }
    if (this.roundTrip) {
      this.wayPoints.push(new L.LatLng(+this.departureAddress.latitude, +this.departureAddress.longitude));
    }

    this.wayPoints.forEach(points => {
      let latitude = points.lat;
      let longitude = points.lng;

      if (x0 == null) {
        x0 = x1 = latitude;
        y0 = y1 = longitude;
      } else {
        if (latitude > x1) x1 = latitude;
        if (latitude < x0) x0 = latitude;
        if (longitude > y1) y1 = longitude;
        if (longitude < y0) y0 = longitude;
      }
    });

    let c1 = new L.LatLng(x1, y1);
    let c2 = new L.LatLng(x0, y0);

    let rt = this.roundTrip;
    let companyAddress = this.departureAddress;
    let wayPointList = this.orderList;
    let dateFormat = this.sDate;
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
    this.map.fitBounds(L.latLngBounds(c1, c2));

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


          const normalWayPointMaker = L.marker(waypoint.latLng, {
            icon: L.icon.glyph({
              prefix: '',
              glyph: (i),
            }),
            draggable: false
          });

          const completedWayPointMaker = L.marker(waypoint.latLng, {
            icon: L.icon.glyph({
              prefix: '',
              glyph: i,
              className: 'xolonium',
              iconUrl: './assets/img/markers/marker-icon-green.png',
            }),
            draggable: false
          });

          const failedWayPointMaker = L.marker(waypoint.latLng, {
            icon: L.icon.glyph({
              prefix: '',
              glyph: i,
              className: 'xolonium',
              iconUrl: './assets/img/markers/marker-icon-red.png',
            }),
            draggable: false
          });

          let wayPointMaker;

          if (rt) {
            if (i === 0 || i === n - 1) {
              return homeMarker.bindPopup(
                "<div class='text-p6 font-weight-semibold'>Start & End</div>" +
                "<div class='text-p6 font-weight-normal'>" + companyAddress.address + ', ' + companyAddress.postcode + ' ' + companyAddress.city + ', ' + companyAddress.state + ', Malaysia' + "</div>"
              );
            }
          } else {
            if (i === 0) {
              return homeMarker.bindPopup(
                "<div class='text-p6 font-weight-semibold'>Start</div>" +
                "<div class='text-p6 font-weight-normal'>" + companyAddress.address + ', ' + companyAddress.postcode + ' ' + companyAddress.city + ', ' + companyAddress.state + ', Malaysia' + "</div>");
            }
          }

          if (wayPointList[i - 1].displayOrderStatus === ListOfOrderStatus.COMPLETED) {
            wayPointMaker = completedWayPointMaker;
          } else if (wayPointList[i - 1].displayOrderStatus === ListOfOrderStatus.FAILED) {
            wayPointMaker = failedWayPointMaker;
          } else {
            wayPointMaker = normalWayPointMaker;
          }

          const popupTemplate =
            "<div class='text-p6 font-weight-semibold'>" + wayPointList[i - 1].displayOrderStatus + ((wayPointList[i - 1].proof && wayPointList[i - 1].proof !== null) ? ' - ' + dateFormat.transform((wayPointList[i - 1].proof.createdAt)) : '') + "</div>" +
            "<div class='text-p6 font-weight-normal'>" + wayPointList[i - 1].displayOrderType + "</div>" +
            "<div class='text-p6 font-weight-normal'>" + wayPointList[i - 1].recipientAddress + ', ' + wayPointList[i - 1].recipientPostcode + ' ' + wayPointList[i - 1].recipientCity + ', ' + wayPointList[i - 1].recipientState + ', Malaysia' + "</div>";

          return wayPointMaker.bindPopup(popupTemplate);
        }
      }),
      routeLine: function (route, i) {
        let routeTime = 0;
        for (let r of route.instructions) {
          if (r.type !== 'WaypointReached' || r.type === 'DestinationReached') {
            routeTime += r.time;
          } else {
            routeTimeList.push(routeTime)
            routeTime = 0;
          }
        }

        let line = L.polyline(route.coordinates, {
          multiOptions: {},
          weight: 7,
          lineCap: 'round',
          lineJoin: 'round',
          opacity: 0.5,
          smoothFactor: 1,
        });

        line.on('mouseover', function () {
          this.setText('  ►  ', {
            repeat: true,
            attributes: {
              fill: 'red',
            },
            center: true
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

  get makerIconPath(): string {
    return './assets/img/markers/';
  }
}
