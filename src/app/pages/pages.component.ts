import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbMediaBreakpointsService, NbSidebarService, NbThemeService, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Employee } from '../../assets/@theme/models/employee.model';
import { AuthService } from '../../assets/@theme/services/auth.service';
import 'quill-emoji/dist/quill-emoji.js';
import { MENU_ITEMS_ADMIN, MENU_ITEMS_MEMBER, MENU_ITEMS_SU_ADMIN } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: './pages.component.html'
})
export class PagesComponent {
  menuSuAdmin = MENU_ITEMS_SU_ADMIN;
  menuAdmin = MENU_ITEMS_ADMIN;
  menuMember = MENU_ITEMS_MEMBER;
  private destroy$: Subject<void> = new Subject<void>();
  mobileView: boolean;
  currentTheme: any;
  modules = {};
  minimize = true;
  maximize = true;
  fullScreen = true;
  close = true;
  employee: Employee;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;

  constructor(
    private themeService: NbThemeService,
    private sidebarService: NbSidebarService,
    private windowService: NbWindowService,
    private authService: AuthService,
    private breakpointService: NbMediaBreakpointsService) {
  }

  ngOnInit() {
    this.employee = this.authService.getAuthData().employee;
    // console.log(this.employee)
    // MOBILE VIEW
    const { sm } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < sm),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.mobileView = isLessThanXl);
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  menuClicked() {
    if (this.mobileView) {
      this.sidebarService.getSidebarState('menu-sidebar').subscribe((data) => {
        let sideBar = document.querySelector('nb-sidebar')
        sideBar.setAttribute('class', 'menu-sidebar fixed left collapsed');
        this.sidebarService.toggle(true, 'menu-sidebar');
      })
    }
  }

  openContactsWindow() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: this.minimize,
      maximize: this.maximize,
      fullScreen: this.fullScreen,
      close: true
    };
    this.windowService.open(
      this.disabledEscTemplate,
      { title: 'Contacts', buttons: buttonsConfig, closeOnBackdropClick: false },
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
