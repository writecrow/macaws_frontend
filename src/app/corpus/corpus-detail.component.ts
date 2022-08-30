import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { AssignmentDescriptionService } from '../services/assignmentDescription.service';
import { CourseDescriptionService } from '../services/courseDescription.service';
import { CorpusDetail } from '../corpus/corpus-detail';
import { Globals } from '../globals';
@Component({
  templateUrl: '../corpus/corpus-detail.component.html',
  styleUrls: ['../corpus/corpus-detail.component.css']
})

export class CorpusDetailComponent implements OnInit {
  content: CorpusDetail;
  exactResources: any[] = [];
  relatedResources: any[] = [];
  exactTexts: any[] = [];
  relatedTexts: any[] = [];
  isLoaded: boolean;
  statusMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private API: APIService,
    private assignments: AssignmentDescriptionService,
    private courses: CourseDescriptionService,
    public globals: Globals,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      this.exactResources = [];
      // Pass 2 parameters to API: the route path, and any query parameters.
      this.API.getCorpusDetailById(routeParams.id, this.route.snapshot.queryParams).subscribe(response => {
        if (response && response[0]) {
          this.content = response[0];
          this.isLoaded = true;
          const exactTexts = {
            'course': this.content.course,
            'institution': this.content.institution,
            'instructor': this.content.instructor,
            'exclude_id': this.content.filename,
          };
          // Retrieve all texts with similar metadata
          this.API.getCorpusReferenceByMetadata(exactTexts).subscribe(response => {
            if (response && response !== '') {
              this.exactTexts = response;
            }
          });
          // const relatedTexts = {
          //   'course': this.content.course,
          //   'institution': this.content.institution,
          //   'assignment_name': this.content.assignment_name,
          //   'genre': this.content.genre,
          //   'excluded_instructor': this.content.instructor,
          // };
          // // Retrieve all texts with similar metadata
          // this.API.getCorpusReferenceByMetadata(relatedTexts).subscribe(response => {
          //   if (response && response !== '') {
          //     this.relatedTexts = response;
          //   }
          // });
          const relatedTexts = {
            'course': this.content.course,
            'institution': this.content.institution,
            'assignment_code': this.content.assignment,
            'excluded_instructor': this.content.instructor,
          };
          // Retrieve all texts with similar metadata
          this.API.getCorpusReferenceByMetadata(relatedTexts).subscribe(response => {
            if (response && response !== '') {
              this.relatedTexts = response;
            }
          });
          // Retrieve repository resources that have matching metadata.
          const repositoryParameters = {
            'course': this.content.course,
            'institution': this.content.institution,
            'instructor': this.content.instructor,
          };
          this.API.getRepositoryReferenceByMetadata(repositoryParameters).subscribe(response => {
            this.globals.inProgress = false;
            if (response && response !== '') {
              this.exactResources = response;
            }
          });
          const relatedRepository = {
            'course': this.content.course,
            'institution': this.content.institution,
            'genre': this.content.genre,
            'exclude_instructor': this.content.instructor,
          };
          this.API.getRepositoryReferenceByMetadata(relatedRepository).subscribe(response => {
            this.globals.inProgress = false;
            if (response && response !== '') {
              this.relatedResources = response;
            }
          });

        }
        else {
          this.router.navigateByUrl('404', { skipLocationChange: true });
        }
      },
      err => {
        // Handle 500s.
        this.isLoaded = true;
        this.statusMessage = 'There was a problem retrieving this resource. You can wait a moment, then try again. If the problem persists, please email the maintainers at <a href="mailto: collaborate@writecrow.org">collaborate@writecrow.org</a>, describing the search parameters you were using, and we will investigate.';
      });
    });
  }

  toggleFacet(i) {
    // Used to show/hide elements in an Angular way.
    // See https://stackoverflow.com/a/35163037
    if (this.globals.repositoryFacets[i] === undefined) {
      this.globals.repositoryFacets[i] = true;
    }
    else if (this.globals.repositoryFacets[i] === false) {
      this.globals.repositoryFacets[i] = true;
    } else {
      this.globals.repositoryFacets[i] = false;
    }
  }

}
