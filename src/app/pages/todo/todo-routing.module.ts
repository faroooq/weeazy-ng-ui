import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodoBoardComponent } from "./todo-board/todo-board.component";
import { TodoComponent } from "./todo.component";

const routes: Routes = [
  {
    path: "",
    component: TodoComponent,
    children: [
      { path: "", component: TodoBoardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule { }
