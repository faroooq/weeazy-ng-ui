import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Employee } from "../models/employee.model";
import { Team } from "../models/team.model";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class EmployeeService {
  constructor(private http: HttpClient) { }

  getEmployees(projectCode) {
    return this.http.get<Employee[]>(`${baseUrl}/users/${projectCode}`);
  }
  // Unassigned Users
  findEmployees(searchQuery, projectCode, excludedIds?, unassigned?) {
    return this.http.get<Employee[]>(`${baseUrl}/users`, { params: { searchQuery, projectCode, excludedIds, unassigned } });
  }
  findEmployeesByTeam(teamId: string) {
    return this.http.get<Employee[]>(`${baseUrl}/teams/${teamId}/employees`);
  }
  findEmployeesByProject(projectId: string) {
    return this.http.get<{ employees: Employee[]; teams: Team[] }>(`${baseUrl}/projects/${projectId}/employees`);
  }
  filterEmployeesArray(arr, query) {
    const searchQuery = query.toLowerCase().split(" ");
    return arr.filter((e) => {
      if (searchQuery.length === 1) {
        return (
          e.firstName.toLowerCase().indexOf(searchQuery[0]) >= 0 ||
          e.lastName.toLowerCase().indexOf(searchQuery[0]) >= 0 ||
          e.email.toLowerCase().indexOf(searchQuery[0]) >= 0
        );
      } else {
        return (
          (e.firstName.toLowerCase().indexOf(searchQuery[0]) >= 0 && e.lastName.toLowerCase().indexOf(searchQuery[1]) >= 0) ||
          (e.firstName.toLowerCase().indexOf(searchQuery[1]) >= 0 && e.lastName.toLowerCase().indexOf(searchQuery[0]) >= 0)
        );
      }
    });
  }
  updateEmployees(employees: Employee[], update: {}) {
    return this.http.patch<Employee[]>(`${baseUrl}/users`, { employees, update });
  }
  updateEmployee(id: string, update: {}) {
    return this.http.patch<Employee>(`${baseUrl}/users/${id}`, { updateQuery: update });
  }
}
