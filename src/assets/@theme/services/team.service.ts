import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Team } from "../models/team.model";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class TeamService {
  constructor(private http: HttpClient) { }

  getTeams(projectId?: string) {
    return this.http.get<Team[]>(`${baseUrl}/teams`, projectId ? { params: { projectId } } : {});
  }

  createTeam(teamName: string, projectId: string) {
    return this.http.post<Team>(`${baseUrl}/teams`, { teamName, projectId });
  }

  deleteTeam(id: string) {
    return this.http.delete(`${baseUrl}/teams/${id}`);
  }

  updateTeam(id: string, update: {}) {
    return this.http.patch<Team>(`${baseUrl}/teams/${id}`, { updateQuery: update });
  }
}
