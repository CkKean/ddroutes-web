export class SetScreenDimension {
  public static type = '[AppState] Set Screen Dimension';

  constructor(public readonly payload: { width: number, height: number }) {
  }
}

export class SetBrowser {
  public static type = '[AppState] Set Browser';

  constructor(public readonly payload:string) {
  }
}

export class SetPlatform {
  public static type = '[AppState] Set Platform';

  constructor(public readonly payload:string) {
  }
}
