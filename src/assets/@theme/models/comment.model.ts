import { Employee } from "./employee.model";

export interface Comment {
  author: Employee;
  content: String;
  createdOn: Date;
}
