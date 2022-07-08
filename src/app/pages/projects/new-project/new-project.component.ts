import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";
import { Employee } from "../../../../assets/@theme/models/employee.model";
import { ProjectService } from "../../../../assets/@theme/services/project.service";
import { EmployeeService } from "../../../../assets/@theme/services/employee.service";
import { AuthService } from "../../../../assets/@theme/services/auth.service";

@Component({
  selector: "app-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.scss"],
})
export class NewProjectComponent implements OnInit {
  employees: Employee[] = [];
  employeesSub: Subscription;
  filteredEmployees: [Employee[]] = [[]];
  assignedEmployees: [Employee[]] = [[]];
  excludedIds: string[] = [];
  projectForm: FormGroup;
  code: any;
  createError: string;
  projectCode: any;
  orgCodeExist: boolean;
  employee: any;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.employee = this.authService.getAuthData().employee;
    this.route.queryParams.subscribe((params) => {
      this.projectCode = params.projectCode;
      this.initForm(params.projectCode);
      this.employeesSub = this.employeeService.findEmployees("", params.projectCode, "", "true").subscribe((employees) => {
        this.employees = employees;
        this.filteredEmployees[0] = [...employees];
      });
    });

  }

  private initForm(code) {
    this.projectForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      code: new FormControl({ value: code, disabled: false }, [Validators.required]),
      description: new FormControl("", [Validators.required]),
      teams: new FormArray([
        new FormGroup({
          name: new FormControl(""),
          employees: new FormArray([]),
        }),
      ]),
    });
  }
  get controls() {
    return (<FormArray>this.projectForm.get("teams")).controls;
  }

  changeEmployeeRole($event, employee) {
    let assignedEmployees = this.assignedEmployees;
    for (let i = 0; i < assignedEmployees.length; i++) {
      for (let j = 0; j < assignedEmployees[i].length; j++) {
        if (employee._id === this.assignedEmployees[i][j]._id)
          this.assignedEmployees[i][j].role = $event;
      }
    }
    // console.log(assignedEmployees)
  }
  onNewProject() {
    if (this.projectForm.invalid) {
      this.createError = "Please fill all the details";
      return;
    }
    if (this.projectForm.valid) {
      let teams = <FormArray>this.projectForm.get("teams").value;
      for (let i = 0; i < teams.length; i++) {
        if (!teams[i].name) {
          (<FormArray>this.projectForm.get("teams")).removeAt(i);
          continue;
        }

        let assignedEmployees = this.assignedEmployees[i];
        if (assignedEmployees.length < 1) {
          this.showToast('warning', 'Add atleast one member to the team');
          return;
        }
        let isAdminExists = false;
        for (let j = 0; j < assignedEmployees.length; j++) {
          if (assignedEmployees[j].role.includes('admin')) {
            isAdminExists = true;
          }
        }
        if (!isAdminExists) {
          this.showToast('warning', 'Team should have atleast one admin');
          return;
        }
        assignedEmployees.push(this.employee)
        for (let j = 0; j < assignedEmployees.length; j++) {
          teams[i].employees.push({ _id: assignedEmployees[j]._id, role: assignedEmployees[j].role });
        }
      }
      let code = <FormControl>this.projectForm.get("code").value;
      this.projectService.createProject(this.projectForm.value, code + '').subscribe(({ message, project }) => {
        this.showToast('success', 'Organization created successfully');
        if (message) this.router.navigate(["/au/login"], { queryParams: { orgcreate: true } });
      });
    }
  }
  onAddTeam() {
    (<FormArray>this.projectForm.get("teams")).push(
      new FormGroup({
        name: new FormControl(""),
        employees: new FormArray([]),
      })
    );
    this.assignedEmployees.push([]);
  }
  onDeleteTeam(index: number) {
    let teams = <FormArray>this.projectForm.get("teams");
    if (index === 0 && teams.length === 1) {
      teams.controls[0].get("name").setValue("");
      return;
    }
    this.assignedEmployees.splice(index, 1);
    teams.removeAt(index);
  }
  filterEmployees(value, index) {
    const filterValue = value.toLowerCase();
    this.filteredEmployees[index] = this.employeeService.filterEmployeesArray(this.employees, value);

    if (this.filteredEmployees[index].length === 0) {
      let code = <FormControl>this.projectForm.get("code").value;
      this.employeeService.findEmployees(value, code + '', "", "true").subscribe((employees) => {
        this.filteredEmployees[index].push(...employees);
      });
    }
  }

  cacheProjectCode() {
    let code = <FormControl>this.projectForm.get("code").value;
    // Checking whether the org already exists or not
    this.projectService.getProject(code + '').subscribe((project) => {
      if (!project || project === null) {
      } else {
        this.orgCodeExist = true;
        this.createError = 'Organization code already exists. Choose different code.';
        return false;
      }
    });
  }

  clearError() {
    this.createError = "";
  }

  onAddEmployeeToTeam(employee, teamIndex) {
    this.excludedIds.push(employee._id);
    for (let emps of this.filteredEmployees) {
      emps.splice(this.employees.indexOf(employee), 1);
    }
    this.assignedEmployees[teamIndex].push(employee);
    this.employees.splice(this.employees.indexOf(employee), 1);
  }
  onDeleteEmployeeFromTeam(employee, teamIndex, employeeIndex) {
    this.excludedIds.splice(this.excludedIds.indexOf(employee._id), 1);
    this.assignedEmployees[teamIndex].splice(employeeIndex, 1);
    for (let emps of this.filteredEmployees) {
      emps.push(employee);
    }
  }

  onExpansionPanelOpened() {
    this.filteredEmployees.push([...this.employees]);
  }
  onExpansionPanelClosed(teamIndex) {
    this.filteredEmployees.splice(teamIndex, 1);
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }
}
