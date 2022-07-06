
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from '../assets/@core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ThemeModule } from '../assets/@theme/theme.module';
import { AuthInterceptor } from '../assets/@theme/interceptors/auth-interceptor';
import { PwaService } from '../assets/@theme/services/pwa.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PromptComponent } from '../assets/@theme/components/propmt/prompt.component';
// import { NbDateFnsDateModule } from '@nebular/date-fns';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    PromptComponent,
  ],
  imports: [
    MatBottomSheetModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    // ** Below module not working with NbDatepickerModule **
    // NbDateFnsDateModule.forRoot({
    //   parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
    //   formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
    // }),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxSmoothDnDModule
  ],
  providers: [
    MatBottomSheet,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PromptComponent,
  ],
})
export class AppModule {
}
