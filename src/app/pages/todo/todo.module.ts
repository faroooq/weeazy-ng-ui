import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo.component';
import { TodoBoardComponent } from './todo-board/todo-board.component';
import { TodoRoutingModule } from './todo-routing.module';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { NbAlertModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule, NbWindowModule } from '@nebular/theme';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../assets/@theme/theme.module';
import { SharedModule } from '../../../assets/shared/shared.module';

@NgModule({
  declarations: [
    TodoComponent,
    TodoBoardComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    TodoRoutingModule,
    NgxSmoothDnDModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbWindowModule.forChild(),
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbAutocompleteModule,
    NbSelectModule,
    SharedModule,
    NbAlertModule
  ]
})
export class TodoModule { }
