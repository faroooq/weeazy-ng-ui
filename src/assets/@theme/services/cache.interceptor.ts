import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Disabling the cache here, to get fresh http request everytime.
        const httpRequest = req.clone({
            headers: new HttpHeaders({
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Access-Control-Allow-Origin': '*'
            })
        });
        return next.handle(httpRequest);
    }
}