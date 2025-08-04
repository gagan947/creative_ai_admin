import { HttpClient } from '@angular/common/http';
import { Injectable, signal, } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  showBtn = signal(false);
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient, private router: Router) { }

  get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, { params });
  };

  postAPI<T, U>(url: string, data: U): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, data)
  };

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url);
  };
}
