import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";
import { isPlatformBrowser } from "@angular/common";
import { Team } from "../../../../assets/@theme/models/team.model";
import { AuthService } from "../../../../assets/@theme/services/auth.service";
import { TeamService } from "../../../../assets/@theme/services/team.service";
import { WindowService } from "../../../../assets/@theme/services/window-service";

@Component({
  selector: "app-team-list",
  templateUrl: "./team-list.component.html",
  styleUrls: ["./team-list.component.scss"],
})
export class TeamListComponent implements OnInit, OnDestroy {

  teams: Team[] = [];
  projectId: string;
  teamsSub: Subscription;
  windowRef: Window;
  settings = {
    actions: {
      add: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Team Name',
        type: 'string',
      },
      employees: {
        title: 'Team Members',
        type: 'string',
        editable: false,
        addable: false,
      },
      openTickets: {
        title: 'Open Tickets',
        type: 'number',
        editable: false,
        addable: false,
      },
      closedTickets: {
        title: 'Closed Tickets',
        type: 'number',
        editable: false,
        addable: false,
      }
    },
  };

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    windowRef: WindowService,
    @Inject(PLATFORM_ID) private platformId: object,
    private toastrService: NbToastrService
  ) {
    this.windowRef = windowRef.getWindow();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.id || this.authService.getProjectId();
    if (!this.projectId) {
      this.settings.actions.add = false;
    }
    this.teamsSub = this.teamService.getTeams(this.projectId).subscribe((teams) => {
      this.teams = teams;
    });
  }

  onAddConfirm(event): void {
    if (event.newData.name) {
      this.teamService.createTeam(event.newData.name, this.projectId).subscribe((team) => {
        this.showToast('success', 'Team created successfully');
        event.confirm.resolve();
      });
    }
  }

  onEditConfirm(event): void {
    this.teamService.updateTeam(event.data._id, event.newData).subscribe((data) => {
      this.showToast('success', 'Team updated successfully');
      event.confirm.resolve();
    })
  }

  selectRecord(event) {
    console.log(event)
    // this.router.navigate(["ps/dashboard"]);
  }

  onDeleteConfirm(event): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRef.confirm('Are you sure you want to delete?')) {
        if (event.data.employees > 0) {
          this.showToast('warning', 'You cannot delete team with member assigned');
          event.confirm.reject();
          return
        }
        if (event.data.openTickets && event.data.openTickets > 0) {
          this.showToast('warning', 'You cannot delete team with open tickets');
          event.confirm.reject();
          return
        }
        if (event.data.closedTickets && event.data.closedTickets > 0) {
          this.showToast('warning', 'You cannot delete team with closed tickets');
          event.confirm.reject();
          return
        }
        this.teamService.deleteTeam(event.data._id).subscribe((data) => {
          this.showToast('success', 'Team deleted successfully');
          event.confirm.resolve();
        })
      } else {
        event.confirm.reject();
      }
    }
  }

  ngOnDestroy() {
    this.teamsSub.unsubscribe();
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }
}
