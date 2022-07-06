import { NgModule } from '@angular/core';
import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesTableComponent } from './employee-list/employees-table/employees-table.component';
import { ShowDialogComponent } from './show-dialog/show-dialog.component';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDialogModule, NbSelectModule, NbToastrModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../assets/@theme/theme.module';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeListComponent,
    EmployeesTableComponent,
    ShowDialogComponent
  ],
  imports: [
    ThemeModule,
    EmployeesRoutingModule,
    NbDialogModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbCardModule,
    NbToastrModule,
    NbAlertModule,
    NbButtonModule
  ],
  exports: [
  ]
})
export class EmployeesModule { }
