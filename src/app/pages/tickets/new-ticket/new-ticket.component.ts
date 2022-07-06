import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Subscription, ReplaySubject, of } from "rxjs";
import { Router } from "@angular/router";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NbComponentStatus, NbTagComponent, NbTagInputAddEvent, NbToastrService } from "@nebular/theme";
import 'quill-emoji/dist/quill-emoji.js';
import Quill from "quill";
import BlotFormatter from "quill-blot-formatter";
import { Team } from "../../../../assets/@theme/models/team.model";
import { Employee } from "../../../../assets/@theme/models/employee.model";
import { TicketService } from "../../../../assets/@theme/services/ticket.service";
import { AuthService } from "../../../../assets/@theme/services/auth.service";
import { TeamService } from "../../../../assets/@theme/services/team.service";
import { EmployeeService } from "../../../../assets/@theme/services/employee.service";
import ImageCompress from 'quill-image-compress';
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register('modules/imageCompress', ImageCompress);

export interface Tags {
  name: string;
}

@Component({
  selector: "app-new-ticket",
  templateUrl: "./new-ticket.component.html",
  styleUrls: ["./new-ticket.component.scss"],
})
export class NewTicketComponent implements OnInit {

  clicked = true;
  projectId: string;
  files = [];
  teams: Team[] = [];
  filteredTeams: ReplaySubject<Team[]> = new ReplaySubject<Team[]>();
  teamFilterControl: FormControl = new FormControl();
  teamsSubscription: Subscription;
  employees: Employee[] = [];
  filteredEmployees: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>();
  employeeFilterControl: FormControl = new FormControl();
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  ticketForm: FormGroup;
  errorMsg: string;
  tags: Set<string> = new Set();
  tagsError: string;
  modules = {};
  content = '';
  employee: Employee;
  isError: boolean = false;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private router: Router,
    private toastrService: NbToastrService
  ) {
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
  }

  // ########QUILL-EDITOR########
  addBindingCreated(quill) {
    quill.keyboard.addBinding({
      key: 'b'
    }, (range, context) => {
      // tslint:disable-next-line:no-console
      console.log('KEYBINDING B', range, context)
    })
    quill.keyboard.addBinding({
      key: 'B',
      shiftKey: true
    }, (range, context) => {
      // tslint:disable-next-line:no-console
      console.log('KEYBINDING SHIFT + B', range, context)
    })
  }
  // ########QUILL-EDITOR########

  ngOnInit(): void {
    this.errorMsg = "";
    this.employee = this.authService.getAuthData().employee;
    this.projectId = this.authService.getProjectId();
    console.log(this.projectId)
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
      project: new FormControl(this.projectId),
      description: new FormControl("", [Validators.required]),
      team: new FormControl("", [Validators.required]),
      assignedTo: new FormControl([], [Validators.required]),
      type: new FormControl("", [Validators.required]),
      tags: new FormControl([]),
      priority: new FormControl("", [Validators.required]),
      files: new FormArray([]),
    });
  }

  onNewTicket() {
    this.logTicket();
  }

  logTicket() {
    const array = Array.from(this.tags);

    if (this.ticketForm.invalid) {
      this.errorMsg = "Please fill all the details.";
      return;
    }
    if (this.tags.size == 0) {
      this.tagsError = "Atleast 1 tag is required";
      return;
    }
    if (this.ticketForm.valid) {
      this.ticketService.createTicket(this.ticketForm.value, array, this.employee.photoUrl)
        .subscribe((res) => {
          if (res.ticket) {
            this.router.navigate(["ps/tickets"]);
            this.showToast('success', 'Ticket created successfully');
          }
        },
          error => {
            if (error.statusText === 'Payload Too Large') {
              this.errorMsg = "Image / Content size is too large.";
            }
          });
    }
  }

  onSelect(event) {
    for (let file of event.addedFiles) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    let formArray = <FormArray>this.ticketForm.get("files");
    formArray.clear();
    for (let file of this.files) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
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

  ngOnDestroy(): void {
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.tags.delete(tagToRemove.text);
    this.tagsError = "";
    this.errorMsg = "";
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    this.tagsError = "";
    this.errorMsg = "";
    if (value) {
      if (this.tags.size <= 4) {
        this.tags.add(value);
      } else {
        this.tagsError = 'Max 5 tags are allowed';
      }
    }
    input.nativeElement.value = '';
  }

  cancel() {
    this.router.navigate(["ps/tickets"]);
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }
}
