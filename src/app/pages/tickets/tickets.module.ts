import { NgModule } from "@angular/core";
import { TicketsComponent } from "./tickets.component";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";
import { QuillModule } from "ngx-quill";
import { NbAccordionModule, NbActionsModule, NbAlertModule, NbBadgeModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbOptionModule, NbRouteTabsetModule, NbSelectModule, NbSidebarModule, NbSpinnerModule, NbTabsetModule, NbTagModule, NbTimepickerModule, NbToastrModule, NbTooltipModule, NB_TIME_PICKER_CONFIG } from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TruncatePipe } from "../../../assets/@theme/pipes/truncate.pipe";
import { TruncateTextPipe } from "../../../assets/@theme/pipes/truncate.text.pipe";
import { TimeAgoExtendsPipe } from "../../../assets/@theme/pipes/time-ago-extends.pipe";
import { SanitizeHtmlPipe } from "../../../assets/@theme/pipes/sanitize-html.pipe";
import { ThemeModule } from "../../../assets/@theme/theme.module";
import { NbMomentDateModule } from "@nebular/moment";
import { SharedModule } from "../../../assets/shared/shared.module";
// import { NbDateFnsDateModule } from "@nebular/date-fns";

@NgModule({
  declarations: [
    TicketsComponent,
    TicketListComponent,
    NewTicketComponent,
    SelectTicketComponent
  ],
  imports: [
    ThemeModule,
    TicketsRoutingModule,
    QuillModule.forRoot(),
    NbCardModule,
    NbIconModule,
    NbOptionModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbInputModule,
    NbAccordionModule,
    NbSidebarModule,
    NbTagModule,
    NbButtonModule,
    NbToastrModule,
    NbAlertModule,
    NbButtonGroupModule,
    NbBadgeModule,
    NbTooltipModule,
    NbMomentDateModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbSpinnerModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    {
      provide: NB_TIME_PICKER_CONFIG,
      useValue: {}
    }
  ]
})
export class TicketsModule { }
