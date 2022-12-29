import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeComponent } from '../authorize/authorize.component';
import { Globals } from '../globals';

@Component({
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.css'],
  providers: [AuthorizeComponent],
})

export class HomeComponent implements OnInit {
  total_words: number;
  total_texts: number;
  resourcesTitle: '';
  resourcesBody: '';
  whatsNewTitle: '';
  whatsNewBody: '';

  constructor(
    private API: APIService,
    private route: ActivatedRoute,
    public globals: Globals,
    private authComponent: AuthorizeComponent,
  ) { }

  ngOnInit(): void {
    this.total_words = 7283469;
    this.total_texts = 8254;
    if (typeof this.route.snapshot.queryParams.auth !== 'undefined') {
      var auth = this.route.snapshot.queryParams.auth.split(':');
      if (auth[1]) {
        this.authComponent.authorize(auth[0].toLowerCase(), auth[1], '');
      }
    }
    this.route.params.subscribe(() => {
      this.API.getPage('resources-and-tutorials').subscribe(response => {
        if (response && response[0]) {
          this.resourcesTitle = response[0].title;
          this.resourcesBody = response[0].body;
        }
      });
    });
    this.route.params.subscribe(() => {
      this.API.getPage('whats-new').subscribe(response => {
        if (response && response[0]) {
          this.whatsNewTitle = response[0].title;
          this.whatsNewBody = response[0].body;
        }
      });
    });
  }
}

