import { NgModule } from '@angular/core';
import { FormsModule, FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbActionsModule, NbAlertModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbOverlayModule, NbPopoverModule, NbRadioModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbStepperModule, NbTabsetModule, NbToastrModule, NbToggleModule, NbUserModule, NbWindowModule } from '@nebular/theme';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ThemeModule } from '../../assets/@theme/theme.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NewProjectComponent } from '../pages/projects/new-project/new-project.component';
import { ContactComponent } from './contact/contact.component';
import { FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AuthRoutingModule,
    ngFormsModule,
    ThemeModule,
    NbRadioModule,
    NbCardModule,
    NbFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbToastrModule,
    NbAlertModule,
    NbSelectModule,
    NbTabsetModule,
    NbIconModule,
    NbPopoverModule,
    NbStepperModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbToggleModule,
    SocialLoginModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    NewProjectComponent,
    ContactComponent
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.gClientId)
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.fAppId),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              '0611ccc3-9521-45b6-b432-039852002705'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  exports: [],
})
export class AuthModule { }
