import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { TeamListComponent } from './team-list/team-list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbAlertModule, NbCardModule, NbToastrModule } from '@nebular/theme';
import { ThemeModule } from '../../../assets/@theme/theme.module';

@NgModule({
  declarations: [
    TeamsComponent,
    TeamListComponent
  ],
  imports: [
    ThemeModule,
    TeamsRoutingModule,
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbToastrModule,
    NbAlertModule
  ],
  exports: []
})
export class TeamsModule { }
