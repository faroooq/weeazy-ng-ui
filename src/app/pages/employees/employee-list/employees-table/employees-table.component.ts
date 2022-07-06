import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, Inject, PLATFORM_ID } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbToastrService } from "@nebular/theme";
import { of, BehaviorSubject, Subscription } from "rxjs";
import { Employee } from "../../../../../assets/@theme/models/employee.model";
import { Team } from "../../../../../assets/@theme/models/team.model";
import { EmployeeService } from "../../../../../assets/@theme/services/employee.service";
import { WindowService } from "../../../../../assets/@theme/services/window-service";
import { ShowDialogComponent } from "../../show-dialog/show-dialog.component";


@Component({
  selector: "app-employees-table",
  templateUrl: "./employees-table.component.html",
  styleUrls: ["./employees-table.component.scss"],
})
export class EmployeesTableComponent implements OnInit, OnDestroy {

  settings = {
    selectMode: 'multi',
    actions: {
      add: false,      //  if you want to remove add button
      edit: false,     //  if you want to remove edit button
      delete: false    //  if you want to remove delete button
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      email: {
        title: 'Email',
        type: 'string',
        editable: false,
        addable: false,
      },
      firstName: {
        title: 'First name',
        type: 'string',
        editable: false,
        addable: false,
      },
      lastName: {
        title: 'Last name',
        type: 'string',
        editable: false,
        addable: false,
      },
      teamName: {
        title: 'Team',
        type: 'string',
      },
      role: {
        title: 'Role',
        type: 'string',
      }
    },
  };
  windowRef: Window;
  employeesSub: Subscription;
  _employees = new BehaviorSubject<Employee[]>([]);
  dataSource: Employee[];
  selectedRecords: any;
  @Input() set employees(value: Employee[]) {
    this._employees.next(value);
  }
  @Input() teams: Team[];
  @Input() isAssigned: boolean;
  @Input() isUnAssigned: boolean;
  @Output() assignEmployees = new EventEmitter<Employee[]>();
  @Output() unassignEmployees = new EventEmitter<Employee[]>();
  roles: string[] = ["admin", "member"];
  selectedRows: number[] = [];

  constructor(
    private employeeService: EmployeeService,
    windowRef: WindowService,
    @Inject(PLATFORM_ID) private platformId: object,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService) {
    this.windowRef = windowRef.getWindow();
  }

  ngOnInit(): void {
    this.employeesSub = this._employees.subscribe((employees) => {
      this.dataSource = employees;
      if (employees.length == 1) {
        this.isAssigned = false;
      }
    });
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }

  onUserRowSelect(event) {
    this.selectedRecords = event.selected;
  }

  updateEmployees(event, updateType) {
    const employees = this.selectedRecords;
    const newValue = event;
    let data = { message: "" };
    let updateQuery = {};
    let adminCount = 0;
    this.dataSource.forEach((data) => {
      if (data.role === 'admin') {
        adminCount++;
      }
    })
    // We are not allowing to add more than 2 admins in FREE Plan.
    // in Manage Members table if user wants to change member to admin.
    if (adminCount >= 2 && newValue === 'admin') {
      this.showToast('warning', 'You can`t add more than 2 admins in free plan.');
      return
    }
    // If only one employee available in Assigned members,
    // And if he is admin, then we are not allowing to un-assign or change role to member.
    if (adminCount == 1 && newValue === 'member'
      && !this.isUnAssigned && employees[0].role === 'member') {
      this.showToast('warning', 'Team should have atleast one admin.');
      return
    }
    // If only one employee available in Assigned members,
    // And if he is admin, then we are not allowing to un-assign or change role to member.
    if (adminCount == 1 && newValue === 'member' && !this.isUnAssigned) {
      this.showToast('warning', 'Team should have atleast one admin');
      return
    }
    // If user selects all records from Assigned members,
    // And try to un-assign, then we are not allowing to un-assign, as we need atleast one admin.
    if (adminCount == 1 && Object.keys(newValue).length === 0 && !this.isUnAssigned) {
      this.showToast('warning', 'Team should have atleast one admin');
      return
    }
    // If user selects all records from Assigned members,
    // And try to un-assign, then we are not allowing to un-assign, as we need atleast one admin.
    if (this.dataSource.length === employees.length
      && !this.isUnAssigned && Object.keys(newValue).length === 0) {
      this.showToast('warning', 'Team should have atleast one admin.');
      return
    }
    // If user selects all records from Assigned members,
    // And try to change to member for all, then we are not allowing to change, as we need atleast one admin.
    if (this.dataSource.length === employees.length && newValue === 'member'
      && !this.isUnAssigned) {
      this.showToast('warning', 'Team should have atleast one admin.');
      return
    }
    // If user selects all admin records and wants to un-assign,
    // then we are not allowing to un-assign, as we need atleast one admin.
    // if (adminCount >= 2 && Object.keys(newValue).length === 0 && !this.isUnAssigned) {
    //   this.showToast('warning', 'Team should have atleast one admin1');
    //   return
    // }
    // TODO: If 2 admins are there in Manage Members table, and if user changed 
    // role from member to admin in Unassigned Members, and try to assign to any team
    // then we should restrict and not to add (or allow ) for FREE plan users.


    this.updateQuery(updateQuery, data, updateType, newValue);

    this.dialogService.open(
      ShowDialogComponent,
    ).onClose.subscribe(confirm => {
      if (confirm) {
        this.employeeService.updateEmployees(employees, updateQuery)
          .subscribe((response) => {
            if (response) {
              let assignedEmployees = [];
              let unassignedEmployees = [];
              this.updateTable(assignedEmployees, unassignedEmployees, updateType, newValue);
              if (assignedEmployees.length) {
                this.assignEmployees.emit(assignedEmployees);
              }
              if (unassignedEmployees.length) {
                this.unassignEmployees.emit(unassignedEmployees);
              }
              if (isPlatformBrowser(this.platformId)) {
                this.windowRef.location.reload();
              }
            }
          });
      }
    });
  }
  private updateQuery(updateQuery: any, data: any, updateType: string, newValue: any) {
    const qty = this.selectedRecords.length;
    if (updateType === "role") {
      // data.message = `Are you sure you want to change the role of ${qty} employees to ${newValue}?`;
      updateQuery["role"] = newValue;
    } else if (updateType === "team" && !newValue._id) {
      // data.message = `Are you sure you want to unassign ${qty} ${qty > 1 ? "employees" : "employee"}?`;
      updateQuery["$unset"] = { team: "" };
    } else if (updateType === "team") {
      // data.message = `Are you sure you want to move ${qty} employees to Team ${newValue.name}?`;
      updateQuery["team"] = newValue._id;
    }
  }

  private updateTable(assignedEmployees: Employee[], unassignedEmployees: Employee[], updateType: string, newValue: any) {
    let refresh: boolean = false;
    for (let i = this.selectedRows.length - 1; i >= 0; i--) {
      let row = this.dataSource[this.selectedRows[i]];
      if (updateType === "role") {
        row.role = newValue;
      } else if (updateType === "team" && !row.team) {
        //move unassigned employee to assigned list
        row.teamName = newValue.name;
        row.team = newValue._id;
        assignedEmployees.push(row);
        this.dataSource.splice(i, 1);
        refresh = true;
      } else if (updateType === "team" && !newValue._id) {
        //unassign employee
        row.teamName = "";
        row.team = null;
        unassignedEmployees.push(row);
        this.dataSource.splice(i, 1);
        refresh = true;
      } else if (updateType === "team") {
        //change team of assigned employee
        row.teamName = newValue.name;
        row.team = newValue._id;
      }
    }
    if (refresh) this.employees = this.dataSource;
    this.selectedRows = [];
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }
}
