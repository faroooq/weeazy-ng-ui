import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.authService.getAuthData()?.isAuth;
    if (!isAuth) {
      this.router.navigate(["/au/login"]);
      return false;
    }
    const roles = route.data.roles;
    if (roles && !roles.some((r) => this.authService.hasRole(r)) && !roles.some((e) => e === "all")) {
      this.router.navigate(["/ps/tickets"]);
      return false;
    }
    return true;
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.getAuthData()?.isAuth;
    if (!isAuth) {
      this.router.navigate(["/au/login"]);
      return false;
    }
    const roles = route.data.roles;
    if (roles && !roles.some((r) => this.authService.hasRole(r)) && !roles.some((e) => e === "all")) {
      this.router.navigate(["/ps/tickets"]);
      return false;
    }
    return true;
  }
}
