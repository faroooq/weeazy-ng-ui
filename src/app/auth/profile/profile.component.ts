import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, RequiredValidator, Validators, FormArray } from "@angular/forms";
import { NbIconConfig, NbThemeService } from "@nebular/theme";
import { ReplaySubject, Subscription } from "rxjs";
import { Employee } from "../../../assets/@theme/models/employee.model";
import { Team } from "../../../assets/@theme/models/team.model";
import { AuthService } from "../../../assets/@theme/services/auth.service";
import { EmployeeService } from "../../../assets/@theme/services/employee.service";
import { TeamService } from "../../../assets/@theme/services/team.service";

@Component({
  selector: 'ngx-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  checked: boolean = false;
  projectId: string;
  passwordsInvalid: boolean = false;
  employee: Employee;
  employeeSub: Subscription;
  changePassword: boolean = false;
  changeDetails: boolean = false;
  detailsForm: FormGroup;
  passwordForm: FormGroup;
  teams: Team[] = [];
  filteredTeams: ReplaySubject<Team[]> = new ReplaySubject<Team[]>();
  teamFilterControl: FormControl = new FormControl();
  teamsSubscription: Subscription;
  employees: Employee[] = [];
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };
  currentTheme = 'default';
  errorMsg: boolean = false;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private themeService: NbThemeService,
    private teamService: TeamService) { }

  ngOnInit(): void {
    this.errorMsg = false;
    //Fetch teams
    this.projectId = this.authService.getProjectId();
    if (this.projectId) {
      this.teamsSubscription = this.teamService.getTeams(this.projectId).subscribe((teams) => {
        this.teams = teams;
        this.filteredTeams.next(this.teams.slice());
      });
    }
    this.teamFilterControl.valueChanges.subscribe(() => {
      this.filterTeams();
    });
    this.employee = this.authService.getAuthData().employee;
    this.detailsForm = new FormGroup({
      firstName: new FormControl({ value: this.employee.firstName, disabled: false }),
      lastName: new FormControl({ value: this.employee.lastName, disabled: false }),
      email: new FormControl({ value: this.employee.email, disabled: false }),
      code: new FormControl({ value: this.employee.code, disabled: true }),
      role: new FormControl({ value: this.employee.role, disabled: true }),
      team: new FormControl({ value: this.employee.team?.name, disabled: true }),
    });
    this.passwordForm = new FormGroup(
      {
        password: new FormControl("", [Validators.required]),
        retypePassword: new FormControl("", [Validators.required]),
      },
      this.passwordMatchValidator
    );
    this.employeeSub = this.authService.loggedEmployeeUpdated.subscribe((employee) => {
      this.employee = employee;
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password").value === g.get("retypePassword").value ? null : { mismatch: true };
  }

  onEditPassword() {
    this.changePassword = !this.changePassword;
  }

  onEditDetails() {
    this.changeDetails = !this.changeDetails;
    if (this.changeDetails) this.detailsForm.enable();
    else this.detailsForm.disable();
  }

  onSubmitDetails() {
    if (this.detailsForm.valid) {
      this.employeeService.updateEmployee(this.employee._id, this.detailsForm.value).subscribe((employee) => {
        this.authService.updateLoggedEmployee(employee);
        this.authService.logout();
        this.changeDetails = false;
      },
        error => {
          console.log(error);
        });
    }
  }

  updatePhoto(changes) {
    this.employeeService.updateEmployee(this.employee._id, changes).subscribe((employee) => {
      this.authService.updateLoggedEmployee(employee);
      this.authService.logout();
      this.changeDetails = false;
    },
      error => {
        if (error.statusText === 'Payload Too Large') {
          this.errorMsg = true;
        }
      });
  }

  onSelect(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        const newPhoto = event.target.result;
        this.updatePhoto({ 'photoUrl': newPhoto });
      }
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      this.passwordsInvalid = false;
      this.employeeService.updateEmployee(this.employee._id, { password: this.passwordForm.value.password }).subscribe((employee) => {
        this.changePassword = false;
        this.authService.logout();
      });
    } else {
      this.passwordsInvalid = true;
    }
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

  ngOnDestroy() {
    if (this.projectId)
      this.teamsSubscription.unsubscribe();
  }

}
