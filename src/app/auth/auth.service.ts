import { Injectable } from '@angular/core';
import {Res} from "../@core/domains/res";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie";
import {Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import jwt_decode from "jwt-decode";

const TOKEN_KEY = '_token_030496';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookie: CookieService,
              private http: HttpClient) { }

  login(body: { username: string, password: string, remember: boolean }): Observable<Res<{ token: string, expires: number }>> {
    return this.http.post<Res<{ token: string, expires: number }>>(`${environment.apiEndpoint}/auth/login`, {
      username: body.username,
      password: body.password
    })
      .pipe(
        tap(res => {
          if (body.remember) {
            this.cookie.put(TOKEN_KEY, res.data.token);
          } else {
            this.cookie.put(TOKEN_KEY, res.data.token, {expires: new Date(res.data.expires)});
          }
        }, err => {
          console.error(err);
        }),
      );
  }

  logout(): Observable<boolean> {
    this.cookie.remove(TOKEN_KEY);
    return this.isAuthorized().pipe(map(v => !v));
  }

  isAuthorized(): Observable<boolean> {
    return of((this.cookie.get(TOKEN_KEY) || null) != null);
  }

  getToken(): string {
    return this.cookie.get(TOKEN_KEY);
  }

  getPayload(): { credentials: any, exp: number, sub: string } {
    return jwt_decode(this.getToken());
  }

  register(body: any): Observable<Res<{ token: string, expires: number }>> {
    return this.http.post<Res<{ token: string, expires: number }>>(`${environment.apiEndpoint}/auth/register`, body);
  }
}
