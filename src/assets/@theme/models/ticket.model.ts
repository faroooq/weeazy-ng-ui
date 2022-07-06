import { Employee } from "./employee.model";
import { Team } from "./team.model";

export interface Tickets {
  totalTickets: Ticket[];
  openTicketCount: string;
  pendingTicketCount: string;
  resolvedTicketCount: string;
  closedTicketCount: string;
}

export interface Ticket {
  number: number;
  _id: number;
  title: string;
  project: string;
  description: string;
  sbeditor: any;
  devResources: string[];
  files: any[];
  photoUrl: string;
  createdOn: Date;
  updatedOn: Date;
  status: string;
  raisedBy: Employee;
  comments: Comment[];
  team: Team;
  priority: string;
  type: string;
  assignedTo: Employee;
  history: any[];
  color: string;
}
