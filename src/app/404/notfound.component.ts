import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: '../404/notfound.component.html',
  styleUrls: ['../404/notfound.component.css']
})

export class NotFoundComponent {

  public href: string = "";

  constructor(private router: Router) { }

  onInit() {
    this.href = this.router.url;
  }
}
