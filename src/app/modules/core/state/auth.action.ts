import {User} from "../../shared/model/register/user.model";
import {AuthStateModel} from "./auth.state";

export class SetAuth {
  public static type = '[AuthState] Set Auth';

  constructor(public readonly payload: AuthStateModel) {
  }
}


export class SetJWTToken {
  public static type = '[AuthState] Set JWT Token';

  constructor(public readonly payload: string) {
  }
}

export class SetRefreshToken {
  public static type = '[AuthState] Set Refresh Token';

  constructor(public readonly payload: string) {
  }
}

export class SetUsername {
  public static type = '[AuthState] Set Username';

  constructor(public readonly payload: string) {
  }
}

export class SetUserInformation {
  public static type = '[AuthState] Set User Information';

  constructor(public readonly payload: User) {
  }
}

export class SetUserType {
  public static type = '[AuthState] Set User Type';

  constructor(public readonly payload: number) {
  }
}

export class ClearAuthState {
  public static type = '[AuthState] Clear Auth State';

  constructor() {
  }
}
