# Corpus & Repository (Frontend)
This is the source code for the front-end of a web-based corpus. What does that mean? A corpus is a collection of texts which can be searched & analyzed. A front-end is the part of a web application that is responsible for the user interface, for sending requests for data & queries to the "back-end," and then displaying that data.

This front-end is designed for a specific dataset, the Corpus and Repository of Writing (Crow), which is an inter-institutional collection of student writing. However, it can also provide a starting point for designing a corpus with a different dataset. And the Crow team is available for support & consulting.

For the live version of the site, visit https://crow.corporaproject.org.

# Table of contents
* [The architecture of this web-based corpus](#architecture)
* [Building your own corpus](#building-your-own-corpus)
* [How to make changes to the code](#usage)
* [How to construct requests via the API](#the-api)
* [Summary of linkages between corpus & repository](#linkages)

# Architecture
Corpora are big-data applications. They must be able to perform complex searches on large datasets. Thanks to the precedents of Google and Amazon, people expect web-based search portals to be fast. Very fast. In order to meet this expectation, a number of contemporary web design patterns must be followed:

- **Decoupled display/data** (see https://pantheon.io/decoupled-cms): instead of delivering all of a web page every time a user performs an action, only update the part of the web page that needs to change.
- **Multiple layers of caching**: the result of computational operations that will yield the same result (until the dataset is updated) can be stored and the memory-intensive operation can be skipped.
- **Search index pre-processing**: each searchable thing (i.e. word) in each resource (i.e., text) in the dataset (i.e, the corpus) must be indexed beforehand so that millions of words don't have to be individually crawled at runtime.

In order to achieve the above, this site was built:
- Using [AngularJS](https://angularjs.org/), a JavaScript framework whose business logic lives in the browser (and therefore greatly reduces the amount of data that must be sent across the internet on each user action)
- Using time-based caching on the front-end, and change-sensitive caching on the back-end
- Using pre-loading of data from the back-end to predict the data a user may request before it is requested

# Building your own corpus
Developing a modern web application requires a not insignificant amount of knowledge not only about a given programming language, but also about programming principles, how data is transferred across the internet, and about the specific framework on which an application is built (in this case, [AngularJS](https://angularjs.org/)). 

The following section will explain how to get up and running for developing with this application, but be forewarned: it may be daunting for non-developers; at the bare minimum, it assumes a familiarity with the command line, `git`, package management, integrated development environments, and local hosting.

These instructions also assume a UNIX-like environment (e.g., Linux, Mac), so if you're using Windows, you'll need to make some accommodations.


1. If you haven't done so, install `node.js` & `npm` : https://docs.npmjs.com/getting-started/installing-node
1. Download this repository as you would normally: `git clone https://github.com/writecrow/corpus_frontend.git`
1. From the directory of the download, run `npm install` to build local components.
1. Run `ng serve` for a dev server. 
1. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Compiling the code for production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# Usage
This application is built on the [AngularJS](https://angularjs.org/) framework, and follows the best practices of said framework. For those familiar with AngularJS, making modifications to the code should be self-obvious.

However, for complete beginners, here are a few orientation tips for making general changes, assuming you have successfully got the site running locally at `http://localhost:4200/`; see above):

- All functional code is located in the `src/app` directory
- The file that defines the "pages" (routes) is `src/app/app.module.ts`
- The back-end base URL is defined in `src/app/api/restAPI.service.ts`. If you have a different back-end, change it here.

Each "component" of the application consists of 
- the `.ts` file, which controls the business logic of route, and the dynamic variables available to the template
- the `.html` file, which defines the markup that will display on the page, and the placeholders for the dynamic data which can be passed from the `.ts` file
- the `.css` file, which adds display elements to the component

# The API
All dynamic data is retrieved from the backend API, whose base URL is defined in `src/app/api/restAPI.service.ts`.

Requests for specific data can be performed by the parameters explained in the backend repository, at https://github.com/writecrow/corpus_backend#performing-search-requests-via-the-api

For example, the following URL:

https://writecrow.corporaproject.org/texts/word?search=friend+woman&op=or&_format=json

will return all texts via a standard word search that include the word "friend" or "woman", returned in JSON format. 

The same result could be returned in XML format with the URL:

https://writecrow.corporaproject.org/texts/word?search=friend%20woman&op=or&_format=xml

A result set that requires "friend" AND "woman" would be: 

https://writecrow.corporaproject.org/texts/word?search=friend%20woman&op=and&_format=json

For a systematic explanation of requesting data from the back-end, see https://github.com/writecrow/corpus_backend#performing-search-requests-via-the-api

# Tests
We proudly ship our code with a series of tests that ensure that functionality will not regress, and that maximum accessibility is maintained. These tests are run via CircleCI, and can be viewed at https://circleci.com/gh/writecrow/corpus_frontend.

## Development server
This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Linkages
The corpus & repository show related materials based on common metadata. The current logic of these linkages is summarized below:

### Repository interface

1. "Other course materials from this instructor"
- Filter logic: same institution + same course + same instructor
- Example: https://macaws.corporaproject.org/repository/1053

2. "Other instructors' materials for similar assignments"
- Filter logic: same institution + same course + same assignment code + different instructor
- Example: https://macaws.corporaproject.org/repository/1053

3. "Student texts for this assignment from this instructor’s course"
- Filter logic: same institution + same course + same semester + same year + same instructor + same assignment code
- Example: https://macaws.corporaproject.org/repository/1053

4. "Student texts for similar assignments"
- Filter logic:  same institution + same course + same assignment code + different instructor
- Example: https://macaws.corporaproject.org/repository/1020

### Corpus interface

1. "Instructor materials related to this course"
- Filter logic: same institution + same course + same instructor + same assignment code OR syllabus
- Example: https://macaws.corporaproject.org/corpus/RSSS_201_ENG_0_DS_0097_DF_30019_UA

2. "Instructor materials for similar assignments"
- Filter logic: same institution + same course + same assignment code + different instructor
- Example: https://macaws.corporaproject.org/corpus/RSSS_201_ENG_0_NR_0101_DF_30010_UA

3. "Other texts from this instructor's [Course] course"
- Filter logic: same institution + same course + same instructor + same student + different text ID
- Example: https://macaws.corporaproject.org/corpus/RSSS_201_ENG_0_DS_0097_DF_30019_UA (The fact that they're all by the same student can be seen by the "30019" in the URL of any of the links.)

4. "Student texts for similar assignments"
- Filter logic: same institution + same course + same assignment code + different instructor
- Example: https://macaws.corporaproject.org/corpus/PORT_325_MLT_0_DS_0047_DF_20213_UA
