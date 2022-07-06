import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Team } from "../../../../assets/@theme/models/team.model";
import { Employee } from "../../../../assets/@theme/models/employee.model";
import { EmployeeService } from "../../../../assets/@theme/services/employee.service";
import { AuthService } from "../../../../assets/@theme/services/auth.service";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  projectId: string;
  teams: Team[] = [];
  assignedEmployees: Employee[] = [];
  employeesSub: Subscription;
  unassignedEmployees: Employee[] = [];
  unassignedEmployeesSub: Subscription;

  constructor(private employeeService: EmployeeService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.id || this.authService.getProjectId();
    if (this.projectId) {
      this.employeesSub = this.employeeService.findEmployeesByProject(this.projectId).subscribe(({ employees, teams }) => {
        this.assignedEmployees = employees;
        this.teams = teams;
      });
      this.unassignedEmployeesSub = this.employeeService.findEmployees("", this.authService.getProjectCode(), "", "true").subscribe((unassignedEmployees) => {
        this.unassignedEmployees = unassignedEmployees;
      });
    }
  }
  ngOnDestroy() {
    this.employeesSub?.unsubscribe();
    this.unassignedEmployeesSub?.unsubscribe();
  }
  onAssignEmployees(assignedEmployees) {
    this.assignedEmployees = [...this.assignedEmployees, ...assignedEmployees];
  }
  onUnassignEmployees(unassignedEmployees) {
    this.unassignedEmployees = [...unassignedEmployees, ...this.unassignedEmployees];
  }
}
