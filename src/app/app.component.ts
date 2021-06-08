import {Component, HostListener, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {SetBrowser, SetPlatform, SetScreenDimension} from "./modules/core/state/app.action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'ddroutes-web';

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.onResize();
    this.setBrowser();
    this.setPlatform();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.store.dispatch(new SetScreenDimension({
      width: window.innerWidth,
      height: window.innerHeight
    }));
  }

  setBrowser() {
    let browser: string;
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      browser = 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      browser = 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      browser = 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      browser = 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1)) {
      browser = 'IE';
    } else {
      browser = 'unknown';
    }
    this.store.dispatch(new SetBrowser(browser));
  }

  setPlatform() {
    this.store.dispatch(new SetPlatform(window.navigator.platform));
  }
}
