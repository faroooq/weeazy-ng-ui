import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";
import { isPlatformBrowser } from "@angular/common";
import { AuthService } from "../../../../assets/@theme/services/auth.service";
import { WindowService } from "../../../../assets/@theme/services/window-service";
import { ProjectService } from "../../../../assets/@theme/services/project.service";
import { Project } from "../../../../assets/@theme/models/project.model";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

@Component({
  selector: 'ngx-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  allColumns = ['name', 'size', 'kind', 'items'];
  projects: Project[] = [];
  projectId: string;
  projectsSub: Subscription;
  windowRef: Window;

  data: TreeNode<FSEntry>[] = [
    {
      data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
      children: [
        { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
        { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
        {
          data: { name: 'project-3', kind: 'dir', size: '466 KB', items: 3 },
          children: [
            { data: { name: 'project-3A.doc', kind: 'doc', size: '200 KB' } },
            { data: { name: 'project-3B.doc', kind: 'doc', size: '266 KB' } },
            { data: { name: 'project-3C.doc', kind: 'doc', size: '0' } },
          ],
        },
        { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB' } },
      ],
    },
    {
      data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
      children: [
        {
          data: { name: 'Report 1', kind: 'dir', size: '100 KB', items: 1 },
          children: [
            { data: { name: 'report-1.doc', kind: 'doc', size: '100 KB' } },
          ],
        },
        {
          data: { name: 'Report 2', kind: 'dir', size: '300 KB', items: 2 },
          children: [
            { data: { name: 'report-2.doc', kind: 'doc', size: '290 KB' } },
            { data: { name: 'report-2-note.txt', kind: 'txt', size: '10 KB' } },
          ],
        },
      ],
    },
    {
      data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
      children: [
        { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
        { data: { name: 'secret-note.txt', kind: 'txt', size: '2 MB' } },
      ],
    },
  ];

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    windowRef: WindowService,
    @Inject(PLATFORM_ID) private platformId: object,
    private toastrService: NbToastrService
  ) {
    // this.windowRef = windowRef.getWindow();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.id || this.authService.getProjectId();
    this.projectsSub = this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  // onAddConfirm(event): void {
  //   if (event.newData.name) {
  //     this.teamService.createTeam(event.newData.name, this.projectId).subscribe((team) => {
  //       this.showToast('success', 'Team created successfully');
  //       event.confirm.resolve();
  //     });
  //   }
  // }

  // onEditConfirm(event): void {
  //   this.teamService.updateTeam(event.data._id, event.newData).subscribe((data) => {
  //     this.showToast('success', 'Team updated successfully');
  //     event.confirm.resolve();
  //   })
  // }

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
        this.projectService.deleteProject(event.data._id).subscribe((data) => {
          this.showToast('success', 'Team deleted successfully');
          event.confirm.resolve();
        })
      } else {
        event.confirm.reject();
      }
    }
  }

  ngOnDestroy() {
    this.projectsSub.unsubscribe();
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }

}
