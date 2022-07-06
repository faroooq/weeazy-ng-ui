import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  mobileView: boolean = false;
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
  newItems = [
    {
      value: 'new-ticket',
      name: 'Ticket',
      link: 'new-ticket'
    },
    // {
    //   value: 'new-doc',
    //   name: 'Doc..',
    //   link: 'new-doc'
    // }
  ];
  currentTheme = 'default';
  mobileMenu = [{ title: 'Profile' }, { title: 'Notification' }, { title: 'Log out' }];
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  user: Employee;
  projectId: any;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.projectId = this.authService.getProjectId();
    this.user = this.authService.getAuthData().employee;
    // MOBILE VIEW
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.mobileView = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  newItem(item: any) {
    this.router.navigate([item]);
    this.router.navigate(["/ps/tickets/" + item]);
  }

  onContecxtItemSelection(title) {
    if (title == 'Log out') {
      this.authService.logout();
    } else if (title == 'Profile') {
      this.router.navigate(["/ps/profile"]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
