import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Ticket, Tickets } from "../models/ticket.model";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class TicketService {
  constructor(private http: HttpClient) { }

  getTickets(projectId?: string, email?: string, role?: string, status?: string, priority?: [], type?: [], date?: any) {
    if (date.start && date.end) {
      return this.http.get<Tickets>(`${baseUrl}/tickets`, projectId ? { params: { project: projectId, ticketOwned: email, role: role, status: status, priority: priority, type: type, startDate: date?.start, endDate: date?.end } } : {});
    } else {
      return this.http.get<Tickets>(`${baseUrl}/tickets`, projectId ? { params: { project: projectId, ticketOwned: email, role: role, status: status, priority: priority, type: type, startDate: 'Invalid Date', endDate: 'Invalid Date' } } : {});
    }
  }

  getTicket(number: number, projectId?: string, email?: string, role?: string) {
    return this.http.get<Ticket>(`${baseUrl}/tickets/${number}`, projectId ? { params: { project: projectId, ticketOwned: email, role: role } } : {});
  }
  findTicketByNumber(projectId: string, number: number) {
    return this.http.get<Ticket>(`${baseUrl}/tickets`, { params: { project: projectId, number: String(number) } });
  }

  addComment(number: number, comment: String) {
    return this.http.post<{ message: String; comment: Comment; ticketHistory }>(`${baseUrl}/tickets/${number}/comments`, { comment });
  }

  getFile(number: number, fileName: String) {
    return this.http.get(`${baseUrl}/tickets/${number}/files/${fileName}`, { responseType: "blob" });
  }

  createTicket(ticket, tags, photoUrl) {
    const ticketData = new FormData();
    ticketData.append("title", ticket.title);
    ticketData.append("project", ticket.project);
    ticketData.append("description", ticket.description);
    ticketData.append("assignedTo", ticket.assignedTo);
    ticketData.append("team", ticket.team);
    ticketData.append("priority", ticket.priority);
    ticketData.append("type", ticket.type);
    ticketData.append("photoUrl", photoUrl);
    for (let tag of tags) {
      ticketData.append("tags", tag);
    }
    for (let file of ticket.files) {
      ticketData.append("files", file.file);
    }
    return this.http.post<{ message: string; ticket: Ticket }>(`${baseUrl}/tickets`, ticketData);
  }

  updateTicket(number: number, changes: any[]) {
    return this.http.patch(`${baseUrl}/tickets/${number}`, { changes });
  }

  deleteTicket(id: number) {
    return this.http.delete(`${baseUrl}/tickets/${id}`);
  }
}
