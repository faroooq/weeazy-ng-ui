import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { NbComponentStatus, NbDateService, NbMediaBreakpointsService, NbSidebarService, NbThemeService, NbToastrService } from "@nebular/theme";
import { Ticket, Tickets } from "../../../../assets/@theme/models/ticket.model";
import { TicketService } from "../../../../assets/@theme/services/ticket.service";
import { AuthService } from "../../../../assets/@theme/services/auth.service";
import { Employee } from "../../../../assets/@theme/models/employee.model";
import { map, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-ticket-list",
  templateUrl: "./ticket-list.component.html",
  styleUrls: ["./ticket-list.component.scss"],
})
export class TicketListComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  tickets: Ticket[];
  ticketsSub: Subscription;
  projectId: string;
  count = 0;
  employee: Employee;
  mobileView: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  status: string;
  priority: [] = [];
  type: [] = [];
  ticketStatus: Tickets;
  ngModelDate = {
    start: new Date(),
    end: new Date(),
  };

  constructor(
    private ticketService: TicketService,
    private sidebarService: NbSidebarService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    protected dateService: NbDateService<Date>,
    private toastrService: NbToastrService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.ngModelDate = {
      start: undefined,
      end: undefined,
    };
    this.employee = this.authService.getAuthData().employee;
    this.status = "PENDING";
    this.priority = [];
    this.type = [];
    this.getTickets(this.status, this.priority, this.type, this.ngModelDate);
    // MOBILE VIEW MODE
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => {
        this.mobileView = isLessThanXl;
      });
  }

  toggle() {
    this.sidebarService.toggle(false, "right");
    return false;
  }

  statusChange(event) {
    this.getTickets(event, this.priority, this.type, this.ngModelDate);
  }

  priorityChange() {
    this.getTickets(this.status, this.priority, this.type, this.ngModelDate);
  }

  dateChange() {
    if (this.ngModelDate) {
      if (this.ngModelDate.start === undefined) {
        this.showToast('warning', 'Start date is required');
        return
      }
      if (this.ngModelDate.end === undefined) {
        this.showToast('warning', 'End date is required');
        return
      }
    } else {
      this.showToast('warning', 'Start date is required');
    }
    this.getTickets(this.status, this.priority, this.type, this.ngModelDate);
  }

  typeChange() {
    this.getTickets(this.status, this.priority, this.type, this.ngModelDate);
  }

  getTickets(status: string, priority: [], type: [], date: any): void {
    this.projectId = this.authService.getProjectId();
    //fetch tickets
    this.status = status;
    this.priority = priority;
    this.type = type;
    if (this.projectId) {
      this.isLoading = true;
      this.ticketsSub = this.ticketService.getTickets(this.projectId, this.employee.email, this.employee.role, this.status, this.priority, this.type, date).subscribe((tickets) => {
        this.tickets = tickets.totalTickets;
        this.ticketStatus = tickets;
        if (tickets.totalTickets.length === 0) {
          this.tickets = undefined;
        }
        this.count = tickets.totalTickets.length;
        this.isLoading = false;
      },
        error => {
          this.isLoading = false;
          console.log(error);
        });
    }
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }

  onSelectTicket(ticketNumber: number) {
    this.router.navigate([ticketNumber], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.projectId)
      this.ticketsSub.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFilters() {
    this.priority = [];
    this.type = [];
    this.ngModelDate = {
      start: undefined,
      end: undefined,
    };
    this.status = "PENDING";
    this.getTickets(this.status, this.priority, this.type, this.ngModelDate);
  }

  newTicket() {
    this.router.navigate(['ps/tickets/new-ticket']);
  }
}
