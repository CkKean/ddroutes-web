import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState} from "../../../core/state/auth.state";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly loginPageBg: string = './assets/img/login_bg1.jpg'

  @SelectSnapshot(AuthState.isAuthenticated) isAuthenticated: boolean;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.navigateMainPage();
    }
  }

  navigateMainPage(): void {
    this.router.navigate(['/']);
  }

}
