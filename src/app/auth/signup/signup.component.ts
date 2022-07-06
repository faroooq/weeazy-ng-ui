import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Project } from "../../../assets/@theme/models/project.model";
import { AuthService } from "../../../assets/@theme/services/auth.service";
import { ProjectService } from "../../../assets/@theme/services/project.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  hide: boolean = true;
  signupError: string;
  options: boolean = false;
  role: string;
  provider: string;
  optionError: string;
  user: SocialUser;
  code: string;
  password: string;
  token: string;
  photoUrl: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.signupError) {
        this.signupError = "User with this email already exists";
      }
    });
    //  TODO: NEED TO ENABLE BASED ON REQUIREMENT 
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    //   console.log(user)
    //   this.role = 'all';
    //   this.code = '';
    //   if (user && user !== null) {
    //     if (user.provider === 'GOOGLE') {
    //       this.password = "";
    //     }
    //     this.authService.createUser(user.email, user.firstName,
    //       user.lastName, this.password, this.role, this.code, user.provider, user.idToken, user.photoUrl);
    //   }
    // });
  }

  loginWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  refreshGoogleToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  toggle() {
    this.options = !this.options;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.signupError = "Please fill all the details";
      return;
    }
    this.provider = 'SELF';
    this.token = "";
    this.photoUrl = "";
    // Checking whether the org already exists or not
    this.projectService.getProject(form.value.code2 + '').subscribe((project) => {
      if (!project) {
        this.isLoading = true;
        if (this.options) {
          this.role = 'member';
        } else {
          this.role = 'suadmin';
        }
        this.code = form.value.code1 ? form.value.code1 : form.value.code2;
        this.authService.createUser(form.value.email, form.value.firstName,
          form.value.lastName, form.value.password, this.role,
          this.code, this.provider, this.token, this.photoUrl);
        this.isLoading = false;
      } else {
        this.signupError = 'Organization code already exists. Choose different code.';
      }
    });
  }
}
