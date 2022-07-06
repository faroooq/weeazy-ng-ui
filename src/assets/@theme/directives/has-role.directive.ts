import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Directive({ selector: "[hasRole]" })
export class HasRoleDirective {
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private authService: AuthService) { }

  @Input() set hasRole(roles: string[]) {
    if (roles.some((e) => this.authService.hasRole(e) || e === "all") && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!roles.some((e) => this.authService.hasRole(e) || e === "all") && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
