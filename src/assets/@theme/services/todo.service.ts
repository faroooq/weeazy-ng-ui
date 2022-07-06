import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Todo, Todos } from "../models/todo.model";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class TodoService {
  constructor(private http: HttpClient) { }

  getTodos(projectId?: string, email?: string, role?: string, status?: string, priority?: [], type?: [], date?: any) {
    if (date.start && date.end) {
      return this.http.get<Todos>(`${baseUrl}/todos`, projectId ? { params: { project: projectId, todoOwned: email, role: role, status: status, priority: priority, type: type, startDate: date?.start, endDate: date?.end } } : {});
    } else {
      return this.http.get<Todos>(`${baseUrl}/todos`, projectId ? { params: { project: projectId, todoOwned: email, role: role, status: status, priority: priority, type: type, startDate: 'Invalid Date', endDate: 'Invalid Date' } } : {});
    }
  }

  getTodo(number: number, projectId?: string, email?: string, role?: string) {
    return this.http.get<Todo>(`${baseUrl}/todos/${number}`, projectId ? { params: { project: projectId, todoOwned: email, role: role } } : {});
  }
  findTodoByNumber(projectId: string, number: number) {
    return this.http.get<Todo>(`${baseUrl}/todos`, { params: { project: projectId, number: String(number) } });
  }

  createTodo(projectId, todo, assignedTo, employee) {
    const todoData = new FormData();
    todoData.append("project", projectId);
    todoData.append("description", todo.description ? todo.description : "Enter Note");
    todoData.append("assignedTo", assignedTo._id);
    todoData.append("team", employee.team._id);
    todoData.append("priority", todo.priority ? todo.priority : "LOW");
    if (todo.priority) {
      todoData.append("priority_id", todo.priority === 'URGENT' ? '1' : todo.priority === 'HIGH' ? '2' : todo.priority === 'MEDIUM' ? '3' : todo.priority === 'LOW' ? '4' : '4');
    }
    todoData.append("photoUrl", employee.photoUrl);
    todoData.append("position", "0");
    todoData.append("column", "0");
    todoData.append("enableEdit", "false");
    return this.http.post<{ message: string; todo: Todo }>(`${baseUrl}/todos`, todoData);
  }

  updateTodo(id: number, changes: any[]) {
    return this.http.patch(`${baseUrl}/todos/${id}`, { changes });
  }

  deleteTodo(id: number) {
    return this.http.delete(`${baseUrl}/todos/${id}`);
  }
}
