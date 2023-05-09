import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjDetail, ProjectComponent } from './component/project/project.component';
import { FollowComponent, bubbleChart } from './component/follow/follow.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NgChartsModule } from 'ng2-charts';
import { BidComponent } from './component/bid/bid.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

import { CookieService } from 'ngx-cookie-service';

const config: SocketIoConfig = { url: environment.websocket, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    ProjDetail,
    FollowComponent,
    bubbleChart,
    BidComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    NgChartsModule,
    MatCardModule,

    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,

    MatInputModule,
    MatRadioModule,
    MatSliderModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,

    MatCardModule,

    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatSidenavModule,


    ReactiveFormsModule,


    SocketIoModule.forRoot(config),

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
