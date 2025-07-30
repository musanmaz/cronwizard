import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CronWizard';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Sayfa yüklendiğinde analytics tracking
    this.analyticsService.trackPageView('/', 'CronWizard - Cron Expression Generator');
  }
}
