import { APIService } from './services/api.service';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { authorizeService } from './services/authorize.service';
import { LoginService } from './services/login.service';
import { Globals } from './globals';

declare var require: any;
declare const gtag: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './macaws.overrides.css'],
  providers: [authorizeService, LoginService],
})
export class AppComponent implements AfterViewInit, OnInit {
  constructor(
    private API: APIService,
    public authorizeService: authorizeService,
    public LoginService: LoginService,
    public globals: Globals,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // When a new page is navigated to, clear out the status message.
        this.globals.statusMessage = "";
      }
      if (event instanceof NavigationEnd) {
        this.globals.previousUrl = this.globals.currentUrl;
        this.globals.currentUrl = event.url;
      }
    });
    const roles = localStorage.getItem('user_roles');
    if (roles !== null && roles.includes('offline')) {
      this.globals.downloadUrl = true;
    }
  }

  ngOnInit(): void {
    this.globals.authenticating = false;
    this.globals.statusMessage = "";
    if (this.authorizeService.isAuthenticated()) {
      this.globals.isAuthenticated = true;
    }
    else {
      this.globals.isAuthenticated = false;
    }
  }
  signIn(): void {
    this.router.navigate(['/authorize']);
  }
  signOut(): void {
    this.LoginService.logout();
    this.router.navigate(['/']);
  }
  exitStatus(): void {
    this.globals.statusMessage = "";
  }
  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('set', 'page', event.urlAfterRedirects);
        gtag('send', 'pageview');
      }
    });
  }
}
