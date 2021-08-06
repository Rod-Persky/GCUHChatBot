import { Injectable } from '@angular/core';
import { Authenticate } from '@synapse/data-models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  isAuthenticated() : Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      return true;
    }
    return false;
  }

  setUserInfo(user : any) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  login(authenticate: Authenticate): Observable<any> {
    return this.httpClient.post('http://devserver.local:3333/login', authenticate);
  }
}