
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../assets/@core/utils/analytics.service';
import { SeoService } from '../assets/@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
