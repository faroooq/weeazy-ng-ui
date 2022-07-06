import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { Project } from "../models/project.model";
import { Ticket } from "../models/ticket.model";
import { Employee } from "../models/employee.model";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class ProjectService {
  constructor(private http: HttpClient, private router: Router) { }

  getProject(id: string) {
    return this.http.get<{ project: Project; tickets: Ticket[] }>(`${baseUrl}/projects/${id}/find`);
  }

  getProjects() {
    return this.http.get<Project[]>(`${baseUrl}/projects`);
  }

  getProjectStatistics(id: string, employee: Employee) {
    // If the user is admin then fetching all tickets statistics by project
    // If the user is member then fething his assigned or raised tickets statistics
    if (employee.role === "admin") {
      return this.http.get<any>(`${baseUrl}/projects/${id}/statistics`);
    } else {
      return this.http.get<any>(`${baseUrl}/projects/${id}/${employee._id}/statistics`);
    }
  }

  createProject(project: Project, orgCode: string) {
    project.code = orgCode;
    return this.http.post<{ message: String; project: Project }>(`${baseUrl}/projects`, { project });
  }

  deleteProject(id: string) {
    return this.http.delete(`${baseUrl}/projects/${id}`);
  }
}
