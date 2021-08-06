// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'synapse-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   constructor() {}

//   ngOnInit() {}

//   login(authenticate:any) {
//     console.log(authenticate);
//   }
// }

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Authenticate } from '@synapse/data-models';


@Component({
  selector: 'synapse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  loginNext(response: any) {
    console.log("login next");
    this.authService.setUserInfo({'user' : response['user']});
  }

  loginError(error: any) {
    console.log("login error");
  }

  loginComplete() {
    console.log("login complete");
  }

  login(authenticate: any) {
    this.authService.login(authenticate).subscribe(
      (r) => this.loginNext(r),
      (e) => this.loginError(e),
      () => this.loginComplete);
  }
}
