import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule } from '@synapse/auth';
import {dachatRoutes, DachatModule} from '@synapse/dachat';
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
        },
        {
          path: 'chat',
          children: dachatRoutes
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
