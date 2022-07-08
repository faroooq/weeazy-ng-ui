import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbMediaBreakpointsService, NbMenuItem, NbThemeService } from "@nebular/theme";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { AuthService } from "../../../assets/@theme/services/auth.service";
import { ProjectService } from "../../../assets/@theme/services/project.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  projectId: string;
  isLoading: boolean = true;
  priority: any;
  status: any;
  team: any;
  type: any;
  dateOpen: any;
  dateClosed: any;
  private destroy$: Subject<void> = new Subject<void>();
  mobileView: boolean = false;
  ticketStatus: NbMenuItem[] = [];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
  ) { }

  ngOnInit(): void {
    this.ticketStatus = [
      {
        title: 'Tickets by type',
        icon: 'person-outline',
        expanded: false,
        children: [

        ],
      },
      {
        title: 'Tickets by status',
        expanded: false,
        icon: 'lock-outline',
        children: [

        ],
      },
      {
        title: 'Tickets by priority',
        expanded: false,
        icon: 'person-outline',
        children: [

        ],
      },
      {
        title: 'Tickets by team',
        expanded: false,
        icon: 'lock-outline',
        children: [

        ],
      },

    ];
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
    const employee = this.authService.getAuthData().employee;
    this.projectId = this.authService.getProjectId();
    if (this.projectId) {
      this.projectService.getProjectStatistics(this.projectId, employee).subscribe((statistics) => {
        this.priority = statistics.categorizedByPriority;
        this.type = statistics.categorizedByType;
        this.status = statistics.categorizedByStatus;
        this.team = statistics.categorizedByTeam;
        this.dateOpen = statistics.categorizedByDateOpen;
        this.dateClosed = statistics.categorizedByDateClosed;
      });
    }
    // else {
    //   if (employee.role !== 'member') {
    //     this.router.navigate(["/ps/org/new"], { queryParams: { projectCode: employee.code } });
    //   }
    // }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
