import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authorizeService } from '../services/authorize.service';
import { LoginService} from '../services/login.service';
import { Globals } from '../globals';
import { APIService } from '../services/api.service';
import { environment } from '../../environments/environment';
@Component({
  templateUrl: '../authorize/authorize.component.html',
  styleUrls: ['../authorize/authorize.component.css'],
  providers: [authorizeService],
})

export class AuthorizeComponent implements OnInit {

  public registration_url = environment.backend + 'user/register';

  constructor(
    private router: Router,
    public authorizeService: authorizeService,
    private api : APIService,
    public LoginService: LoginService,
    private globals: Globals
  ) { }

  ngOnInit(): void {
    // There is no reason for currently authenticated users to see this route.
    if (this.authorizeService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  authorize(name: string, pass: string, additional: string): void {
    this.globals.authenticating = true;
    name = name.trim();
    if (!name || additional !== "" ) { return; }
    let user: any = { name, pass };
    this.LoginService.login(user.name, user.pass).subscribe(
      data => {
        // 'data' is the Token object
        this.router.navigate(['/']);
        this.globals.isAuthenticated = true;
        this.globals.authenticating = false; 
        this.api.getDefaultCorpusSearchResults().subscribe(response => {
        });
      },
      err => {
        this.globals.isAuthenticated = false;
        this.globals.authenticating = false;
      }
    );
  }
}
