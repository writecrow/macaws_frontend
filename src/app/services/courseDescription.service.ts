import { mockCourseDescriptions } from '../services/mock.courseDescriptions';
import { Injectable } from "@angular/core";

@Injectable()
export class CourseDescriptionService {

  constructor() { }

  getDescription(course): string {
    for (const i in mockCourseDescriptions) {
      if (mockCourseDescriptions[i].course === course) {
        return mockCourseDescriptions[i].description;
      }
    }
    return '';
  }

}
