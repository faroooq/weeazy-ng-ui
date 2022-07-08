import { FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { response } from "express";
import { AuthData } from "../../../assets/@theme/models/auth-data.model";
import { AuthService } from "../../../assets/@theme/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginError: string;
  signupMessage: string;
  user: SocialUser;
  GoogleLoginProvider = GoogleLoginProvider;
  role: string;
  code: string;
  password: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.signupMessage = "";
    this.route.queryParams.subscribe((params) => {
      if (params.loginError) {
        this.loginError = "Wrong email or password.";
      }
      if (params.signup) {
        this.signupMessage = "User successfully created.";
      }
      if (params.orgcreate) {
        this.signupMessage = "Organization created successfully.";
      }
    });
    //  TODO: NEED TO ENABLE BASED ON REQUIREMENT 
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    //   if (user) {
    //     let response = { user: user, token: user.idToken }
    //     this.authService.saveUser(response);
    //   }
    // });
  }

  // loginWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }

  // refreshGoogleToken(): void {
  //   this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.loginError = "Please fill all the details";
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    this.isLoading = false;
  }

  onDestroy() {
  }
}
