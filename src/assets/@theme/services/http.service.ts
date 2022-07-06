import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const baseUrl = environment.midtierurl;

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) { }

    getAll(events): Observable<any> {
        return this.http.get(`${baseUrl}/${events}`);
    }

    get(endpoint, id): Observable<any> {
        return this.http.get(`${baseUrl}/${endpoint}/${id}`);
    }

    create(endpoint, data): Observable<any> {
        return this.http.post(`${baseUrl}/${endpoint}`, data);
    }

    update(id, data): Observable<any> {
        return this.http.put(`${baseUrl}/${id}`, data);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseUrl}/${id}`);
    }

    deleteAll(): Observable<any> {
        return this.http.delete(baseUrl);
    }

    findByTitle(title): Observable<any> {
        return this.http.get(`${baseUrl}?title=${title}`);
    }

    getCountryCodes() {
        return this.http.get<any>('./assets/json/country-codes.json');
    }
}