import { Component } from '@angular/core';
import { NbMediaBreakpointsService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html'
})
export class OneColumnLayoutComponent {
  mobileView: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService) {
  }

  ngOnInit() {
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => {
        this.mobileView = isLessThanXl
        // console.log(this.mobileView)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
