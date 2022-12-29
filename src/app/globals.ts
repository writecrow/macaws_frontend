import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isAuthenticated: boolean = false;
  inProgress = false;
  statusMessage: string = "";
  authenticating: boolean = false;
  downloadUrl: boolean = false;
  corpusFacets: any[] = [];
  repositoryFacets: any[] = [];
  currentUrl = '';
  previousUrl = '';
}
