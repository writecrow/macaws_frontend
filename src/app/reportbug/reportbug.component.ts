import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';
import { authorizeService } from '../services/authorize.service';
import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  templateUrl: '../reportbug/reportbug.component.html',
  styleUrls: ['../reportbug/reportbug.component.css']
})

export class ReportBugComponent implements OnInit {
  model: any = {};
  contact = true;

  constructor(
    private route: ActivatedRoute,
    public authorizeService: authorizeService,
    private router: Router,
    private API: APIService,
    public globals: Globals,
  ) {
    this.contact = true;
  }

  ngOnInit(): void {
    if (!this.authorizeService.isAuthenticated()) {
      // If not authorized, redirect to the login page.
      this.router.navigate(['/authorize']);
    }
  }

  public onSubmit(title, description, contact) {
    const userAgent = window.navigator.userAgent;
    this.API.submitIssue(title, description, contact, location.origin + this.globals.previousUrl, userAgent).subscribe(response => {
      this.router.navigateByUrl(this.globals.previousUrl);
      if (contact) {
        this.globals.statusMessage = 'Thanks for providing feedback. Expect updates from us about the issue.';
      } else {
        this.globals.statusMessage = 'Thanks for providing feedback. Our team will work to fix the issue.';
      }
    });

  }
}
