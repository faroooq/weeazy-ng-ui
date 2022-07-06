import { Employee } from "./employee.model";
import { Team } from "./team.model";

export interface Project {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  employees: Employee[];
  teams: Team[];
  message: string;
}
