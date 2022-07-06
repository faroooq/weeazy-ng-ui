import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Subject, ReplaySubject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbComponentStatus, NbMediaBreakpointsService, NbSidebarService, NbThemeService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService } from "@nebular/theme";
import { Ticket } from "../../../../assets/@theme/models/ticket.model";
import { Team } from "../../../../assets/@theme/models/team.model";
import { TicketService } from "../../../../assets/@theme/services/ticket.service";
import { AuthService } from "../../../../assets/@theme/services/auth.service";
import { TeamService } from "../../../../assets/@theme/services/team.service";
import { EmployeeService } from "../../../../assets/@theme/services/employee.service";
import { Employee } from "../../../../assets/@theme/models/employee.model";
import { isPlatformBrowser } from "@angular/common";
import { WindowService } from "../../../../assets/@theme/services/window-service";
import ImageCompress from 'quill-image-compress';
import BlotFormatter from "quill-blot-formatter";
import Quill from "quill";
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register('modules/imageCompress', ImageCompress);

@Component({
  selector: "app-select-ticket",
  templateUrl: "./select-ticket.component.html",
  styleUrls: ["./select-ticket.component.scss"],
})
export class SelectTicketComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  mobileView: boolean = false;
  isLoading: boolean = false;
  ticket: Ticket;
  ticketSub: Subscription;
  projectId: string;
  files = [];
  teams: Team[] = [];
  filteredTeams: ReplaySubject<Team[]> = new ReplaySubject<Team[]>();
  filteredEmployees: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>();
  teamFilterControl: FormControl = new FormControl();
  teamsSubscription: Subscription;
  comment: FormControl = new FormControl();
  employees: Employee[] = [];
  employeeFilterControl: FormControl = new FormControl();
  modules = {};
  content = '';
  @ViewChild('item') accordion;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  ticketForm: FormGroup;
  toggleContent: boolean = false;
  windowRef: Window;
  errorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private sidebarService: NbSidebarService,
    private authService: AuthService,
    private themeService: NbThemeService,
    private windowService: NbWindowService,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    windowRef: WindowService,
    @Inject(PLATFORM_ID) private platformId: object,
    private toastrService: NbToastrService,
    private breakpointService: NbMediaBreakpointsService) {
    // ########QUILL-EDITOR########
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      blotFormatter: {
        // empty object for default behaviour.
      },
      'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction
        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        // [{ 'font': [] }],
        [{ 'align': [] }],
        // ['clean'],                                         // remove formatting button
        ['link', 'image', 'video'],                         // link and image, video
        ['emoji']
      ],
      imageCompress: {
        quality: 1.6, // default 0.7
        maxWidth: 1000, // default
        maxHeight: 1000, // default
        imageType: 'image/jpeg', // default
        debug: true, // default
      }
    }
    // ########QUILL-EDITOR########
    this.windowRef = windowRef.getWindow();
  }

  minimize = true;
  maximize = false;
  fullScreen = false;
  close = true;
  employee: Employee;

  ngOnInit(): void {
    this.errorMsg = "";
    this.isLoading = true;
    this.projectId = this.authService.getProjectId();
    this.employee = this.authService.getAuthData().employee;
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
    //Fetch ticket and employees
    this.ticketSub = this.route.params
      .pipe(
        switchMap((params) =>
          this.ticketService.getTicket(params.id, this.projectId, this.employee.email, this.employee.role)
        ),
        switchMap((ticket) => {
          this.ticket = ticket;
          this.ticketForm.get("title").setValue(this.ticket.title);
          this.ticketForm.get("description").setValue(this.ticket.description);
          this.ticketForm.get("team").setValue(this.ticket.team._id);
          this.ticketForm.get("assignedTo").setValue(this.ticket.assignedTo?._id);
          this.ticketForm.get("status").setValue(this.ticket.status);
          this.ticketForm.get("type").setValue(this.ticket.type);
          this.ticketForm.get("priority").setValue(this.ticket.priority);
          return this.employeeService.findEmployeesByTeam(ticket.team._id);
        })
      )
      .subscribe((employees) => {
        this.employees = employees;
        this.filteredEmployees.next(this.employees.slice());
      });
    //Fetch teams
    this.teamsSubscription = this.teamService.getTeams(this.projectId).subscribe((teams) => {
      this.teams = teams;
      this.filteredTeams.next(this.teams.slice());
    });

    this.teamFilterControl.valueChanges.subscribe(() => {
      this.filterTeams();
    });
    this.employeeFilterControl.valueChanges.subscribe(() => {
      this.filterEmployees();
    });
    this.initForm();
  }

  private initForm() {
    this.ticketForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      description: new FormControl("",),
      team: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      assignedTo: new FormControl("", [Validators.required]),
    });
  }

  onLoadEmployees(event) {
    this.employeeService.findEmployeesByTeam(event).subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees.next(this.employees.slice());
    });
  }
  private filterTeams() {
    if (!this.teams) {
      return;
    }
    let search = this.teamFilterControl.value;
    if (!search) {
      this.filteredTeams.next(this.teams.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTeams.next(this.teams.filter((team) => team.name.toLowerCase().indexOf(search) > -1));
  }

  private filterEmployees() {
    if (!this.employees) {
      return;
    }
    let search = this.employeeFilterControl.value;
    if (!search) {
      this.filteredEmployees.next(this.employees.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEmployees.next(this.employeeService.filterEmployeesArray(this.employees, search));
  }

  ngOnDestroy() {
    this.ticketSub.unsubscribe();
    this.teamsSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNewComment() {
    this.ticketService.addComment(this.ticket.number, this.comment.value).subscribe(({ message, comment, ticketHistory }) => {
      this.ticket.comments.push(comment);
      this.ticket.history.push(ticketHistory);
      this.comment.reset();
      this.accordion.toggle();
    });
  }

  cancel() {
    this.toggleContent = !this.toggleContent;
  }

  onEditTicket() {
    const changes = [];
    const ticketFormValue = this.ticketForm.value;
    if (ticketFormValue.title !== this.ticket.title) {
      changes.push({ attribute: "title", oldValue: this.ticket.title, newValue: ticketFormValue.title });
    }
    if (ticketFormValue.assignedTo !== this.ticket.assignedTo?._id) {
      const employee = this.employees.find((e) => e._id === ticketFormValue.assignedTo);
      changes.push({
        attribute: "assignedTo",
        oldValue: `${this.ticket.assignedTo?.firstName || ""} ${this.ticket.assignedTo?.lastName || ""}`,
        newValue: `${employee.firstName} ${employee.lastName}`,
        id: ticketFormValue.assignedTo,
      });
    }
    if (ticketFormValue.team !== this.ticket.team._id) {
      const team = this.teams.find((team) => team._id === ticketFormValue.team);
      changes.push({ attribute: "team", oldValue: this.ticket.team.name, newValue: team.name, id: ticketFormValue.team });
    }
    if (ticketFormValue.description !== this.ticket.description) {
      changes.push({ attribute: "description", oldValue: this.ticket.description, newValue: ticketFormValue.description });
    }
    if (ticketFormValue.status !== this.ticket.status) {
      changes.push({ attribute: "status", oldValue: this.ticket.status, newValue: ticketFormValue.status });
    }
    if (ticketFormValue.priority !== this.ticket.priority) {
      changes.push({ attribute: "priority", oldValue: this.ticket.priority, newValue: ticketFormValue.priority });
    }
    if (ticketFormValue.type !== this.ticket.type) {
      changes.push({ attribute: "type", oldValue: this.ticket.type, newValue: ticketFormValue.type });
    }
    changes.push({ attribute: "updatedOn", oldValue: this.ticket.createdOn, newValue: new Date() });
    this.updateTicket(changes);
  }

  updateTicket(changes) {
    this.ticketService.updateTicket(this.ticket.number, changes).subscribe((response) => {
      this.showToast('success', 'Ticket updated successfully');
      this.router.navigate(["ps/tickets"]);
    },
      error => {
        if (error.statusText === 'Payload Too Large') {
          this.errorMsg = "Image / Content size is too large.";
        }
      });
  }

  toggleAccordion() {
    this.accordion.toggle();
  }

  editContent() {
    this.toggleContent = !this.toggleContent;
  }

  openWindowWithoutBackdrop() {
    // const buttonsConfig: NbWindowControlButtonsConfig = {
    //   minimize: this.minimize,
    //   maximize: this.maximize,
    //   fullScreen: this.fullScreen,
    // };
    // this.windowService.open(
    //   this.disabledEscTemplate,
    //   { title: 'History', buttons: buttonsConfig, closeOnBackdropClick: false },
    // );
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }

  onDeleteConfirm(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRef.confirm('Are you sure you want to delete?')) {
        this.ticketService.deleteTicket(this.ticket._id).subscribe((data) => {
          this.showToast('success', 'Ticket deleted successfully');
          this.router.navigate(["ps/tickets"]);
        })
      } else {
      }
    }
  }

  gotoTickets() {
    this.router.navigate(["ps/tickets"]);
  }
}
