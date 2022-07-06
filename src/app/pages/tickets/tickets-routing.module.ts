import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { TicketsComponent } from "./tickets.component";

const routes: Routes = [
  {
    path: "",
    component: TicketsComponent,
    children: [
      { path: "", component: TicketListComponent },
      { path: "new-ticket", component: NewTicketComponent },
      { path: ":id", component: SelectTicketComponent },
      // { path: ":id/edit", component: EditTicketComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule { }
