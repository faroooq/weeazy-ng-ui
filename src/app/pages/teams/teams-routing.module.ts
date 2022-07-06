import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TeamListComponent } from "./team-list/team-list.component";
import { TeamsComponent } from "./teams.component";

const routes: Routes = [
  {
    path: "",
    component: TeamsComponent,
    children: [
      {
        path: "",
        component: TeamListComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
