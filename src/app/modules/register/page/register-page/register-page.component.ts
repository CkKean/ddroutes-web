import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState} from "../../../core/state/auth.state";

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
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
