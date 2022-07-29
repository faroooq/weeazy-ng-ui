import { Inject, Injectable, NgZone, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../models/auth-data.model";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../environments/environment";
import { Employee } from "../models/employee.model";
import { WindowService } from "../services/window-service";
import { ContactData } from "../models/contact-data.model";
import { NbComponentStatus, NbToastrService } from "@nebular/theme";
import { SocialAuthService } from "@abacritt/angularx-social-login";

const baseUrl = environment.midtierurl

@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenTimer: any;
  private isAuthenticated: boolean;
  loggedEmployee: Employee;
  loggedEmployeeUpdated = new Subject<Employee>();
  private token: string;
  windowRef: Window;

  constructor(
    private http: HttpClient,
    private router: Router,
    windowRef: WindowService,
    private _ngZone: NgZone,
    private toastrService: NbToastrService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = windowRef.getWindow();
  }

  getToken() {
    return this.getAuthData()?.token;
  }

  createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string,
    code: string,
    provider: string,
    token: string,
    photoUrl: string) {
    const authData: AuthData = { email, firstName, lastName, password, role, code, provider, token, photoUrl };
    this.http.post(`${baseUrl}/auth/signup`, authData).subscribe(
      (response) => {
        if (response) this.router.navigate(["/au/login"], { queryParams: { signup: true } });
        // if (response) this.router.navigateByUrl('/au/login');
      },
      (err) => {
        console.log(err)
        this.router.navigate(["/au/signup"], { queryParams: { signupError: true } });
      }
    );
  }
  login(email: string, password: string) {
    this.http
      .post<{ token: string; user: Employee }>(`${baseUrl}/auth/login`, { email, password })
      .subscribe(
        (response) => {
          this.saveUser(response);
        },
        (err) => {
          this.router.navigate(["/au/login"], { queryParams: { loginError: true } });
        }
      );
  }

  public saveUser(response) {
    const token = response.token;
    this.token = token;
    if (token) {
      // const expiresInDuration = response.expiresIn;
      // this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.loggedEmployee = response.user;
      // const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
      this.saveAuthData(token, this.loggedEmployee);
      if (response.user?.team.length > 0) {
        this.router.navigate(['/ps/dashboard']);
      } else {
        if (response.user?.role === 'member') {
          this.router.navigate(['/ps/dashboard']);
        } else {
          this.router.navigate(["/ps/org/new"], { queryParams: { projectCode: response.user.code } });
        }
      }
    }
  }

  // private setAuthTimer(expiresInDuration: number) {
  //   console.log("setting timer to " + expiresInDuration);
  //   this.tokenTimer = setTimeout(() => {
  //     this.logout();
  //   }, expiresInDuration * 1000);
  // }

  logout() {
    // clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    // this.socialAuthService.signOut();
    this.clearAuthData();
    this._ngZone.run(() => {
      this.router.navigate(["/au/login"]);
    });
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getProjectId() {
    return this.getAuthData().employee.team[0]?.project?._id;
  }

  getProjectCode() {
    return this.getAuthData().employee.team[0]?.project?.code;
  }

  hasRole(role: string) {
    return this.getAuthData().isAuth && this.getAuthData().employee.role?.toLowerCase() === role?.toLowerCase();
  }

  isAdmin() {
    return this.getAuthData().isAuth && this.getAuthData().employee.role.toLowerCase() === "suadmin";
  }

  private saveAuthData(token: string, employee: Employee) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.localStorage.setItem("token", token);
      // this.windowRef.localStorage.setItem("expiration", expirationDate.toISOString());
      this.windowRef.localStorage.setItem("loggedEmployee", JSON.stringify(employee));
      this.windowRef.localStorage.setItem("isAuthenticated", "true");
    }
  }

  private clearAuthData() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.localStorage.removeItem("token");
      // this.windowRef.localStorage.removeItem("expiration");
      this.windowRef.localStorage.removeItem("loggedEmployee");
      this.windowRef.localStorage.removeItem("isAuthenticated");
    }
  }

  // autoAuthUser() {
  //   const authInformation = this.getAuthData();
  //   if (!authInformation) {
  //     return;
  //   }
  //   const now = new Date();
  //   const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
  //   if (expiresInDuration > 0) {
  //     this.token = authInformation.token;
  //     this.isAuthenticated = true;
  //     this.loggedEmployee = authInformation.employee;
  //     this.setAuthTimer(expiresInDuration / 1000);
  //   }
  // }

  getAuthData() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.windowRef.localStorage.getItem("token");
      const isAuth = this.windowRef.localStorage.getItem("isAuthenticated");
      // const expirationDate = this.windowRef.localStorage.getItem("expiration");
      const employee = JSON.parse(this.windowRef.localStorage.getItem("loggedEmployee"));
      if (!token) {
        return;
      }
      return {
        token,
        employee,
        isAuth
      };
    }
  }

  updateLoggedEmployee(employee: Employee) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.localStorage.setItem("loggedEmployee", JSON.stringify(employee));
    }
    this.loggedEmployee = employee;
    this.loggedEmployeeUpdated.next(employee);
  }

  contact(email: string, firstName: string, lastName: string, type: string, desc: string) {
    const contactData: ContactData = { email, firstName, lastName, type, desc };
    this.http.post(`${baseUrl}/contact`, contactData).subscribe(
      (response) => {
        if (response) {
          this.showToast('success', 'Request has been received.');
        }
      },
      (err) => {
        console.log(err)
      }
    );
  }

  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }
}
