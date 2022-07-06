import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { ThemeModule } from '../../../assets/@theme/theme.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbAlertModule, NbButtonModule, NbCardModule, NbToastrModule, NbTreeGridModule } from '@nebular/theme';
import { ProjectsListComponent } from './projects-list/projects-list.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsListComponent
  ],
  imports: [
    ThemeModule,
    ProjectsRoutingModule,
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbToastrModule,
    NbAlertModule,
    NbTreeGridModule,
    NbButtonModule
  ],
  exports: []
})
export class ProjectsModule { }
