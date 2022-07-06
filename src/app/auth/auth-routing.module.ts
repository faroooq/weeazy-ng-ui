import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../assets/@theme/guards/auth.guard';

import { AuthComponent } from './auth.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { NewProjectComponent } from '../pages/projects/new-project/new-project.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: "signup",
        component: SignupComponent
      },
      {
        path: "ps/states/new",
        component: NewProjectComponent,
        // canActivate: [AuthGuard],
        // canLoad: [AuthGuard],
        // data: { roles: ["suadmin", "admin"] },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AuthRoutingModule {
}

