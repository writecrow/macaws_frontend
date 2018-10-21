import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { RepositoryDetail } from '../repository/repository-detail';

@Component({
  templateUrl: '../repository/repository-search.component.html',
  styleUrls: ['../repository/repository-search.component.css']
})

export class RepositorySearchComponent {
  searchResults: RepositoryDetail[];
  Facets: any[] = [];
  FacetKeys: any[] = [];
  isLoaded: boolean;
  searchInProgress: boolean;
  searchString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
  ) {
    this.querySearch(); 
   }

  querySearch() {
    // The main search function. Looks for the current URL parameters & sends those to the backend.
    this.searchInProgress = true;
    this.route.queryParams.subscribe((routeParams) => {
      if (routeParams.search != 'undefined') {
        // Set the text input to the query provided in the URL.
        this.searchString = routeParams.search;
      }
      this.API.searchRepository(routeParams).subscribe(response => {
        if (response && response.search_results) {
          this.searchResults = response.search_results;
          this.isLoaded = true;
          // Do additional modifications on the returned API data.
          this.adjustLabels(this.searchResults);
        }
        else {
        }
        if (response && response.facets) {
          this.prepareFacets(response.facets);
        }
        this.searchInProgress = false;
      });
    });
  }

  textSearch(terms: string): void {
    // Called on click of search button.
    // Merges user-supplied search term into existing URL and calls querySearch().
    this.router.navigate(['/repository'], { queryParams: { search: terms }, queryParamsHandling: 'merge' });
  }

  prepareFacets(facets) {
    // The order in which these are pushed into the "Facets" object determine their order in the sidebar.
    this.Facets = <any>[];
    this.Facets['document_type'] = { label: 'Document Type', show: true, index: '3' };
    this.Facets['assignment'] = { label: 'Assignment', show: true, index: '0' };
    this.Facets['institution'] = { label: 'Institution', show: false, index: '5' };
    this.Facets['year'] = { label: 'Year', show: false, index: '9' };
    this.Facets['semester'] = { label: 'Semester', show: false, index: '8' };
    this.Facets['course'] = { label: 'Course', show: false, index: '1' };
    this.Facets['mode'] = { label: 'Mode', show: false, index: '7' };
    this.Facets['course_length'] = { label: 'Length', show: false, index: '2' };
    this.Facets['file_type'] = { label: 'File Type', show: false, index: '4' };
    this.FacetKeys = Object.keys(this.Facets);
    // Loop through each of the defined facets for this repository and assign
    // values returned from the API to their object.
    for (let name in this.Facets) {
      let i = this.Facets[name].index;
      if (typeof facets[i][0] !== 'undefined') {
        this.Facets[name].values = facets[i][0][name];
      }
      else {
        this.Facets[name].values = [];
      }
    }
  }

  adjustLabels(searchResults) {
    // Append additional information to title for clarity.
    for (let i in searchResults) {
      if (searchResults[i].document_type == 'Syllabus') {
        this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].course);
      }
      if (['Assignment Sheet', 'Checklist', 'Peer Review Form', 'Rubric', 'Sample Work'].includes(searchResults[i].document_type)) {
        this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].assignment);
      }
      if (searchResults[i].document_type == 'Handout') {
        if (searchResults[i].assignment != '') {
          this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].assignment);
        }
        else if (searchResults[i].course != '') {
          this.searchResults[i].document_type = this.searchResults[i].document_type.concat(': ' + searchResults[i].course);
        }  
      }
    }
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.Facets[i].show === false) {
      this.Facets[i].show = true;
    } else {
      this.Facets[i].show = false;
    }
  }

  reset() {
    this.router.navigate(['/repository']);
  }
}