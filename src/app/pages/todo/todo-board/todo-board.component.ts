
import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { NbComponentStatus, NbMediaBreakpointsService, NbThemeService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { applyDrag, generateItems } from '../todo-utils';
import { AuthService } from '../../../../assets/@theme/services/auth.service';
import { TodoService } from '../../../../assets/@theme/services/todo.service';
import { Todo, Todos } from '../../../../assets/@theme/models/todo.model';
import { EmployeeService } from '../../../../assets/@theme/services/employee.service';
import { Employee } from '../../../../assets/@theme/models/employee.model';
import { isPlatformBrowser } from '@angular/common';
import { WindowService } from '../../../../assets/@theme/services/window-service';

const columnNames = ['To-Do', 'In-Progress', 'Completed', 'Closed'];

@Component({
  selector: 'ngx-todo-board',
  templateUrl: './todo-board.component.html',
  styleUrls: ['./todo-board.component.scss']
})
export class TodoBoardComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  mobileView: boolean;
  minimize = true;
  maximize = true;
  fullScreen = true;
  close = true;
  todoSub: Subscription;
  projectId: string;
  status: string;
  priority: [] = [];
  type: [] = [];
  scene: {
    type: string;
    children: any[];
  };
  windowRef: Window;
  modules = {};
  isLoading: boolean = false;
  count: number;
  ngModelDate = {
    start: new Date(),
    end: new Date(),
  };
  ticketStatus: Todos;
  todos: Todo[];
  employee: any;
  errorMsg: string;
  employees: Employee[];
  options: Employee[];
  filteredNgModelOptions$: Observable<Employee[]>;
  value: string;
  addNoteEnable: boolean = false;

  constructor(
    private authService: AuthService,
    private themeService: NbThemeService,
    private todoService: TodoService,
    private employeeService: EmployeeService,
    private breakpointService: NbMediaBreakpointsService,
    private toastrService: NbToastrService,
    windowRef: WindowService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) { this.windowRef = windowRef.getWindow(); }

  ngOnInit(): void {
    this.projectId = this.authService.getProjectId();
    this.employee = this.authService.getAuthData().employee;
    this.ngModelDate = {
      start: undefined,
      end: undefined,
    };
    this.status = "";
    this.priority = [];
    this.type = [];
    // MOBILE VIEW
    const { lg } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < lg),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => {
        this.mobileView = isLessThanXl;
      });
    this.getTodoList(this.status, this.priority, this.type, this.ngModelDate);

    this.autoComplete();
  }
  private autoComplete() {
    this.options = [];
    this.employeeService.findEmployeesByTeam("allemptodos").subscribe((employees) => {
      this.employees = employees;
      for (let i = 0; i < employees.length; i++) {
        this.options.push(employees[i])
      }
      this.filteredNgModelOptions$ = of(this.options);
    })
  }

  private filter(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.firstName.toLowerCase().includes(filterValue));
  }

  onModelChange(value: string) {
    console.log(value)
    this.filteredNgModelOptions$ = of(this.filter(value));
  }

  getTodoList(status: string, priority: [], type: [], date: any): void {
    this.projectId = this.authService.getProjectId();
    //fetch todos
    this.status = status;
    this.priority = priority;
    this.type = type;
    if (this.projectId) {
      this.isLoading = true;
      this.todoSub = this.todoService.getTodos(this.projectId, this.employee.email, this.employee.role, this.status, this.priority, this.type, date).subscribe((tickets) => {
        this.todos = tickets.totalTodos;
        if (tickets.totalTodos.length === 0) {
          this.todos = undefined;
        }
        this.count = tickets.totalTodos.length;
        this.isLoading = false;

        this.createTodoBoard(this.todos);
      },
        error => {
          this.isLoading = false;
          console.log(error);
        });
    }
  }

  // https://github.com/kutlugsahin/ngx-smooth-dnd
  createTodoBoard(todos) {
    this.scene = {
      type: 'container',
      // Headings
      children: generateItems(4, (i) => ({
        id: `column${i}`,
        type: 'container',
        name: columnNames[i],
        // Cards
        children: generateItems(0, (j) => ({
          id: `${i}${j}`,
          description: "Add Note",
          enableEdit: false
        }))
      }))
    }
    if (todos) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].status === 'OPEN') {
          this.scene.children[0].children.push(
            {
              // id - managing id in UI side
              id: `${0}${i}`,
              // _id - edit, delete operations
              _id: todos[i]._id,
              // noteId - card id
              noteId: todos[i].noteId,
              createdOn: todos[i].createdOn,
              description: todos[i].description,
              status: todos[i].status,
              raisedBy: todos[i].raisedBy.firstName,
              assignedFirstName: todos[i].assignedTo[0].firstName,
              assignedLastName: todos[i].assignedTo[0].lastName,
              priority: todos[i].priority,
              priority_id: todos[i].priority_id,
              photoUrl: todos[i].assignedTo[0].photoUrl,
              enableEdit: (todos[i].enableEdit === 'true')
            }
          )
        } else if (todos[i].status === 'PENDING') {
          this.scene.children[1].children.push(
            {
              id: `${1}${i}`,
              _id: todos[i]._id,
              noteId: todos[i].noteId,
              createdOn: todos[i].createdOn,
              description: todos[i].description,
              status: todos[i].status,
              raisedBy: todos[i].raisedBy.firstName,
              assignedFirstName: todos[i].assignedTo[0].firstName,
              assignedLastName: todos[i].assignedTo[0].lastName,
              priority: todos[i].priority,
              priority_id: todos[i].priority_id,
              photoUrl: todos[i].assignedTo[0].photoUrl,
              enableEdit: (todos[i].enableEdit === 'true')
            }
          )
        } else if (todos[i].status === 'RESOLVED') {
          this.scene.children[2].children.push(
            {
              id: `${2}${i}`,
              _id: todos[i]._id,
              noteId: todos[i].noteId,
              createdOn: todos[i].createdOn,
              description: todos[i].description,
              status: todos[i].status,
              raisedBy: todos[i].raisedBy.firstName,
              assignedFirstName: todos[i].assignedTo[0].firstName,
              assignedLastName: todos[i].assignedTo[0].lastName,
              priority: todos[i].priority,
              priority_id: todos[i].priority_id,
              photoUrl: todos[i].assignedTo[0].photoUrl,
              enableEdit: (todos[i].enableEdit === 'true')
            }
          )
        } else if (todos[i].status === 'CLOSED') {
          this.scene.children[3].children.push(
            {
              id: `${3}${i}`,
              _id: todos[i]._id,
              noteId: todos[i].noteId,
              createdOn: todos[i].createdOn,
              description: todos[i].description,
              status: todos[i].status,
              raisedBy: todos[i].raisedBy.firstName,
              assignedFirstName: todos[i].assignedTo[0].firstName,
              assignedLastName: todos[i].assignedTo[0].lastName,
              priority: todos[i].priority,
              priority_id: todos[i].priority_id,
              photoUrl: todos[i].assignedTo[0].photoUrl,
              enableEdit: (todos[i].enableEdit === 'true')
            }
          )
        }
      }
    }
  }

  clearNote() {
    this.addNoteEnable = !this.addNoteEnable;
    this.scene.children[0].children.shift(
      {
        id: this.scene.children[0].children.length,
        data: ''
      }
    )
  }

  closeEdit(card) {
    card.enableEdit = !card.enableEdit;
  }

  addNote(column) {
    this.addNoteEnable = !this.addNoteEnable;
    if (this.addNoteEnable) {
      this.scene.children[0].children.unshift(
        {
          id: this.scene.children[0].children.length + 1,
          noteId: this.scene.children[0].children.length + 1,
          data: 'new',
          photoUrl: this.employee.photoUrl,
          enableEdit: true,
        }
      )
    } else {
      // CREATING A NEW NOTE
      this.filteredNgModelOptions$.subscribe((assignedTo) => {
        this.todoService.createTodo(this.projectId, column.children[0], assignedTo[0], this.employee)
          .subscribe((res) => {
            if (res) {
              this.showToast('success', 'Todo created successfully');
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                  this.windowRef.location.reload();
                }, 100);
              }
            }
          },
            error => {
              this.showToast('danger', 'Todo creation Failed');
              this.scene.children[0].children.shift(
                {
                  id: this.scene.children[0].children.length,
                  data: ''
                }
              )
            });
      })
    }
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }

  enableEdit(card) {
    card.enableEdit = !card.enableEdit;
  }

  editNote(card) {
    card.enableEdit = !card.enableEdit;
    const changes = [];
    this.filteredNgModelOptions$.subscribe((assignedTo) => {
      changes.push({
        attribute: "assignedTo",
        oldValue: `${this.scene.children[0].children[0].assignedFirstName || ""} ${this.scene.children[0].children[0].assignedLastName || ""}`,
        newValue: `${assignedTo[0].firstName} ${assignedTo[0].lastName}`,
        id: assignedTo[0]._id,
      });
      // Adding if conditions like below are not working.
      // if (this.scene.children[0].children[0].description !== card.description) {
      changes.push({ attribute: "description", oldValue: this.scene.children[0].children[0].description, newValue: card.description });
      // }
      changes.push({ attribute: "priority", oldValue: this.scene.children[0].children[0].priority, newValue: card.priority });
      if (card.priority === 'URGENT') {
        changes.push({ attribute: "priority_id", oldValue: this.scene.children[0].children[0].priority_id, newValue: '1' });
      } else if (card.priority === 'HIGH') {
        changes.push({ attribute: "priority_id", oldValue: this.scene.children[0].children[0].priority_id, newValue: '2' });
      } else if (card.priority === 'MEDIUM') {
        changes.push({ attribute: "priority_id", oldValue: this.scene.children[0].children[0].priority_id, newValue: '3' });
      } else if (card.priority === 'LOW') {
        changes.push({ attribute: "priority_id", oldValue: this.scene.children[0].children[0].priority_id, newValue: '4' });
      }
      this.todoService.updateTodo(card.noteId, changes).subscribe((response) => {
        this.showToast('success', 'Todo updated successfully');
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.windowRef.location.reload();
          }, 100);
        }
      },
        error => {
          this.showToast('danger', 'Todo update failed');
        });
    })
  }

  deleteNote(card) {
    this.todoService.deleteTodo(card._id).subscribe((data) => {
      this.showToast('success', 'Todo deleted successfully');
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.windowRef.location.reload();
        }, 100);
      }
    })
  }

  onCardDrop(columnId, dropResult) {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.scene);
      const column = scene.children.filter(p => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(column.id, newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      const { payload } = dropResult;
      // this.scene = newColumn;
      this.updateTodo(payload);
    }
  }

  updateTodo(payload) {
    const changes = [];
    changes.push({ attribute: "position", oldValue: payload?.position, newValue: payload?.position });
    changes.push({ attribute: "column", oldValue: payload?.column, newValue: payload?.column });
    if (payload.column === 'column0') {
      changes.push({ attribute: "status", oldValue: payload.status, newValue: 'OPEN' });
    } else if (payload.column === 'column1') {
      changes.push({ attribute: "status", oldValue: payload.status, newValue: 'PENDING' });
    } else if (payload.column === 'column2') {
      changes.push({ attribute: "status", oldValue: payload.status, newValue: "RESOLVED" });
    } else if (payload.column === 'column3') {
      changes.push({ attribute: "status", oldValue: payload.status, newValue: 'CLOSED' });
    }
    this.todoService.updateTodo(payload.noteId, changes).subscribe((response) => {
      // this.showToast('success', 'Todo updated successfully');
    })
  }

  getCardPayload(columnId) {
    return (index) => {
      return this.scene.children.filter(p => p.id === columnId)[0].children[index];
    }
  }

  ngOnDestroy() {
    if (this.projectId)
      this.todoSub.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
