import { mockCourseDescriptions } from '../services/mock.courseDescriptions';

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
