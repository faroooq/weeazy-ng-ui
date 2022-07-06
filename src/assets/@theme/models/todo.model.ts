import { Employee } from "./employee.model";
import { Team } from "./team.model";

export interface Todos {
  totalTodos: Todo[];
  openTodoCount: string;
  pendingTodoCount: string;
  resolvedTodoCount: string;
  closedTodoCount: string;
}

export interface Todo {
  _id: number;
  noteId: number;
  project: string;
  description: string;
  photoUrl: string;
  createdOn: Date;
  updatedOn: Date;
  status: string;
  raisedBy: Employee;
  priority: string;
  position: number;
  assignedTo: Employee;
  enableEdit: boolean;
}
