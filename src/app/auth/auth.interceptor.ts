import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Access-Control-Allow-Origin': '*',
        'Accept-Language': 'vi_VN',
      }),
    });
    return next.handle(request)
  }
}
