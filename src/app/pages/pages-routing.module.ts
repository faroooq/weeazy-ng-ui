import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ProfileComponent } from '../auth/profile/profile.component';
import { AuthGuard } from '../../assets/@theme/guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: "profile",
      component: ProfileComponent,
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin", "member", "all"] }
    },
    {
      path: "dashboard",
      loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin", "member"] },
    },
    // {
    //   path: "org",
    //   loadChildren: () => import("./projects/projects.module").then((m) => m.ProjectsModule),
    //   canActivate: [AuthGuard],
    //   canLoad: [AuthGuard],
    //   data: { roles: ["all"] },
    // },
    {
      path: "states",
      loadChildren: () => import("./projects/projects.module").then((m) => m.ProjectsModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin"] },
    },
    {
      path: "teams",
      loadChildren: () => import("./teams/teams.module").then((m) => m.TeamsModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin"] },
    },
    {
      path: "users",
      loadChildren: () => import("./employees/employees.module").then((m) => m.EmployeesModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin"] },
    },
    {
      path: "tickets",
      loadChildren: () => import("./tickets/tickets.module").then((m) => m.TicketsModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin", "member"] },
    },
    {
      path: "todos",
      loadChildren: () => import("./todo/todo.module").then((m) => m.TodoModule),
      canActivate: [AuthGuard],
      canLoad: [AuthGuard],
      data: { roles: ["suadmin", "admin", "member"] },
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
