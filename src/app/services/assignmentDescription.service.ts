import { mockAssignmentDescriptions } from './mock.assignmentDescriptions';
import { Injectable } from "@angular/core";

@Injectable()
export class AssignmentDescriptionService {

  constructor() { }

  getDescription(name): string {
    for (var i in mockAssignmentDescriptions) {
      if (mockAssignmentDescriptions[i].name == name) {
        return mockAssignmentDescriptions[i].description;
      }
    }
    return '';
  }

}
