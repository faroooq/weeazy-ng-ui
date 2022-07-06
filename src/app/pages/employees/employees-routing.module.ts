import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeesComponent } from "./employees.component";

const routes = [
  {
    path: "",
    component: EmployeesComponent,
    children: [
      {
        path: "",
        component: EmployeeListComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
