import {SortModel} from "./sort.model";

export class RouteOptimizationRequestModel {
  sortList: SortModel[];
  optimizeType: string;
  routeId: string;
  departurePoint: number;
};
