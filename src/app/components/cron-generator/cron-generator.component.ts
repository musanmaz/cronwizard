import { Component } from '@angular/core';
import { CronService } from '../../services/cron.service';
import { AnalyticsService } from '../../services/analytics.service';
import * as cronParser from 'cron-parser';

@Component({
  selector: 'app-cron-generator',
  templateUrl: './cron-generator.component.html',
  styleUrls: ['./cron-generator.component.css']
})
export class CronGeneratorComponent {
  type: string = 'Minutes';
  interval: number = 1;
  cronExpression: string = '';
  inputCronExpression: string = '';
  nextDates: string[] = [];
  copyButtonText: string = 'Copy';

  // Saatlik seçenekler
  hourlyOption: string = 'every';
  startHour: number = 12;
  startMinute: number = 0;

  // Günlük seçenekler
  dailyOption: string = 'everyday';

  // Haftalık seçenekler
  weeklyDays: { [key: string]: boolean } = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  };

  // Aylık seçenekler
  monthlyOption: string = 'day';
  monthlyDay: number = 1;
  monthlyWeek: number = 1;
  monthlyWeekday: number = 1;

  // Yıllık seçenekler
  yearlyOption: string = 'every';
  yearlyMonth: number = 1; // 1-based index for months
  yearlyDay: number = 1;
  yearlyWeek: number = 1;
  yearlyWeekday: number = 1;

  constructor(
    private cronService: CronService,
    private analyticsService: AnalyticsService
  ) {}

  generateCron() {
    let cronExpr = '';
    switch (this.type) {
      case 'Minutes':
        cronExpr = `*/${this.interval} * * * *`;
        break;
      case 'Hourly':
        if (this.hourlyOption === 'every') {
          cronExpr = `0 */${this.interval} * * *`;
        } else if (this.hourlyOption === 'startsAt') {
          cronExpr = `${this.startMinute} ${this.startHour} * * *`;
        }
        break;
      case 'Daily':
        if (this.dailyOption === 'everyday') {
          cronExpr = `${this.startMinute} ${this.startHour} * * *`;
        } else if (this.dailyOption === 'weekday') {
          cronExpr = `${this.startMinute} ${this.startHour} * * 1-5`;
        }
        break;
      case 'Weekly':
        const days = [];
        for (const [day, isSelected] of Object.entries(this.weeklyDays)) {
          if (isSelected) {
            switch (day) {
              case 'Monday':
                days.push(1);
                break;
              case 'Tuesday':
                days.push(2);
                break;
              case 'Wednesday':
                days.push(3);
                break;
              case 'Thursday':
                days.push(4);
                break;
              case 'Friday':
                days.push(5);
                break;
              case 'Saturday':
                days.push(6);
                break;
              case 'Sunday':
                days.push(0);
                break;
            }
          }
        }
        cronExpr = `${this.startMinute} ${this.startHour} * * ${days.join(',')}`;
        break;
      case 'Monthly':
        if (this.monthlyOption === 'day') {
          cronExpr = `${this.startMinute} ${this.startHour} ${this.monthlyDay} */${this.interval} *`;
        } else if (this.monthlyOption === 'week') {
          cronExpr = `${this.startMinute} ${this.startHour} ? */${this.interval} ${this.monthlyWeek}#${this.monthlyWeekday}`;
        }
        break;
      case 'Yearly':
        if (this.yearlyOption === 'every') {
          cronExpr = `${this.startMinute} ${this.startHour} ${this.yearlyDay} ${this.yearlyMonth} *`;
        } else if (this.yearlyOption === 'week') {
          cronExpr = `${this.startMinute} ${this.startHour} ? ${this.yearlyMonth} ${this.yearlyWeek}#${this.yearlyWeekday}`;
        }
        break;
      default:
        cronExpr = `*/${this.interval} * * * *`;
    }

    // Quartz cron format to Unix cron format conversion
    cronExpr = cronExpr.replace('?', '*');

    this.cronExpression = cronExpr;
    
    // Analytics tracking
    this.analyticsService.trackCronGeneration(this.type);
  }

  calculateNextDates() {
    try {
      const interval = cronParser.parseExpression(this.inputCronExpression, { currentDate: new Date() });
      this.nextDates = [];
      for (let i = 0; i < 5; i++) {
        this.nextDates.push(interval.next().toString());
      }
      
      // Analytics tracking
      this.analyticsService.trackNextDatesCalculation();
    } catch (err) {
      console.error('Error parsing cron expression:', err);
      this.nextDates = ['Invalid cron expression'];
    }
  }

  copyCronExpression() {
    navigator.clipboard.writeText(this.cronExpression).then(() => {
      this.copyButtonText = 'Copied';
      setTimeout(() => {
        this.copyButtonText = 'Copy';
      }, 1000);
      
      // Analytics tracking
      this.analyticsService.trackCronCopy();
    }).catch(err => {
      console.error('Failed to copy cron expression: ', err);
    });
  }

  getWeeklyDaysKeys() {
    return Object.keys(this.weeklyDays);
  }

  isWeeklyDaySelected(day: string): boolean {
    return this.weeklyDays[day];
  }

  toggleWeeklyDay(day: string) {
    this.weeklyDays[day] = !this.weeklyDays[day];
  }
}
