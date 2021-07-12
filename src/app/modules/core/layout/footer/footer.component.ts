import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  readonly googlePlayIcon: string = './assets/img/google-play-icon.png'

  constructor() { }

  ngOnInit(): void {
  }

}
