import { Team } from "./team.model";

export interface Employee {
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
  role: string;
  code: string;
  team: Team;
  teamName?: string;
  photoUrl: string;
}
