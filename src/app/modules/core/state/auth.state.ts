import {Action, Selector, State, StateContext} from "@ngxs/store";
import {JwtUtil} from "../../shared/utils/jwt.util";
import {Injectable} from "@angular/core";
import {
  ClearAuthState,
  SetAuth,
  SetJWTToken,
  SetRefreshToken,
  SetUserInformation,
  SetUsername,
  SetUserType
} from "./auth.action";
import {User} from "../../shared/model/register/user.model";

export class AuthStateModel {
  username: string;
  jwtToken: string;
  refreshToken: string;
  userType: number;
  authenticated: boolean;
  expiredAt: Date;
  userInformation: User
}

const authStateDefault: AuthStateModel = {
  username: null,
  jwtToken: null,
  refreshToken: null,
  userType: null,
  authenticated: false,
  expiredAt: null,
  userInformation: null
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    ...authStateDefault
  }
})
@Injectable()
export class AuthState {
  constructor(private jwtUtil: JwtUtil) {
  }

  @Selector()
  static getJwtToken(state: AuthStateModel) {
    return state.jwtToken;
  }

  @Selector()
  static getRefreshToken(state: AuthStateModel) {
    return state.refreshToken;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    // return state.jwtToken && state.username && state.userType.toString();
    return state.authenticated;
  }

  @Selector()
  static getUsername(state: AuthStateModel) {
    return state.username;
  }

  @Selector()
  static getUserType(state: AuthStateModel) {
    return state.userType;
  }

  @Selector()
  static getUserInformation(state: AuthStateModel) {
    return state.userInformation;
  }

  @Action(SetJWTToken)
  setJwtToken(ctx: StateContext<AuthStateModel>, action: SetJWTToken) {
    const state = ctx.getState();
    // const authorities: Array<string> = this.jwtUtil.retrieveAuthorities(action.payload)
    ctx.setState({...state, jwtToken: action.payload});
  }

  @Action(SetUsername)
  setUsername(ctx: StateContext<AuthStateModel>, action: SetUsername) {
    const state = ctx.getState();
    ctx.setState({...state, username: action.payload});
  }

  @Action(SetUserType)
  setUserType(ctx: StateContext<AuthStateModel>, action: SetUserType) {
    const state = ctx.getState();
    ctx.setState({...state, userType: action.payload});
  }

  @Action(SetRefreshToken)
  setRefreshToken(ctx: StateContext<AuthStateModel>, action: SetRefreshToken) {
    const state = ctx.getState();
    ctx.setState({...state, refreshToken: action.payload});
  }

  @Action(SetUserInformation)
  setUserInformation(ctx: StateContext<AuthStateModel>, action: SetUserInformation) {
    const state = ctx.getState();
    ctx.setState({...state, userInformation: action.payload});
  }

  @Action(ClearAuthState)
  clearAuthState({setState}: StateContext<AuthStateModel>) {
    setState({
      ...authStateDefault
    });
  }

  @Action(SetAuth)
  setAuth(ctx: StateContext<AuthStateModel>, action: SetAuth) {
    ctx.setState({
      expiredAt: action.payload.expiredAt,
      refreshToken: null,
      authenticated: action.payload.authenticated,
      userType: action.payload.userType,
      userInformation: action.payload.userInformation,
      jwtToken: action.payload.jwtToken,
      username: action.payload.username
    });
  }
}
