import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Select} from "@ngxs/store";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {AuthState} from "../state/auth.state";

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  @Select(AuthState.getJwtToken) jwtToken$;
  @Select(AuthState.getRefreshToken) refreshToken$;
  jwtToken: string;
  refreshToken: string;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
    this.jwtToken$.subscribe(x => {
      this.jwtToken = x;
    })
    this.refreshToken$.subscribe(x => {
      this.refreshToken = x;
    })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.resolveToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.resolveToken()}`,
        },
      });
    }

    return next.handle(request);
  }

  resolveToken(): string {
    return this.jwtToken;
  }

}
