// This file is based on the canonical example from 
// https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/http-interceptors/caching-interceptor.ts
// as well as a simplified version in 
// https://fullstack-developer.academy/caching-http-requests-with-angular/
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { RequestCache } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req);
    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = this.sendRequest(req, next, this.cache);
      return cachedResponse ?
        results$.pipe(startWith(cachedResponse)) :
        results$;
    }
    // cache-or-fetch
    if (cachedResponse) {
      console.log('Returned from cache');
    }
    return cachedResponse ?
      of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCache): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}