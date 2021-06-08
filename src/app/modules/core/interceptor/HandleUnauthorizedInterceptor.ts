import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {Store} from "@ngxs/store";
import {ShowAccessDeniedModal, ShowSessionTimeoutModal} from "../state/modal.action";
import {throwError} from "rxjs/internal/observable/throwError";

@Injectable()
export class HandleUnauthorizedInterceptor implements HttpInterceptor {
  constructor(private store: Store) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse && (err as HttpErrorResponse).status === 401 || (err as HttpErrorResponse).status === 403) {
            if (err && err.error && err.error.status === 'access.denied') {
              this.store.dispatch(new ShowAccessDeniedModal());
            } else {
              console.log('jwt expired');
              this.store.dispatch(new ShowSessionTimeoutModal());
            }
            return of();
          } else {
            return throwError(err);
          }
        })
      ) as Observable<HttpEvent<any>>;
  }
}
