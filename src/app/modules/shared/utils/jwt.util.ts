import {Injectable} from "@angular/core";
import {JWTToken} from "../model/jwt.model";

@Injectable({
  providedIn:'root'
})
export class JwtUtil{
  retrieveAuthorities(token:string):Array<string>{
    return this.parseJwt(token).authorities;
  }

  parseJwt(token:string):JWTToken{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  }
}
