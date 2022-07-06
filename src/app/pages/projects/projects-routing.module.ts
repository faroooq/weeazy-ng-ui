import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { NewProjectComponent } from './new-project/new-project.component';

const routes: Routes = [
  {
    path: "",
    component: ProjectsComponent,
    children: [
      {
        path: "",
        component: ProjectsListComponent
      },
      {
        path: "new",
        component: NewProjectComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {
}
