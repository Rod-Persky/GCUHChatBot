// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [BrowserModule],
//   providers: [],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule } from '@synapse/auth';  //added
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: 'auth',
          children: authRoutes
        }
      ],
      { initialNavigation: 'enabled' }
    ),
    AuthModule,
    StoreModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';

// import { AppComponent } from './app.component';
// import { NxModule } from '@nrwl/nx';
// import { RouterModule } from '@angular/router';
// import { authRoutes, AuthModule } from '@synapse/auth';  //added

// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     BrowserModule,
//     NxModule.forRoot(),
//     RouterModule.forRoot([{path: 'auth', children: authRoutes}], { initialNavigation: 'enabled' }),
//     AuthModule     // added
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}
