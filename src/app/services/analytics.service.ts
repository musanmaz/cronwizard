import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  /**
   * Sayfa görüntüleme olayını gönderir
   * @param pagePath Sayfa yolu
   * @param pageTitle Sayfa başlığı
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }

  /**
   * Özel olay gönderir
   * @param eventName Olay adı
   * @param parameters Olay parametreleri
   */
  trackEvent(eventName: string, parameters?: { [key: string]: any }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  /**
   * Cron ifadesi oluşturma olayını gönderir
   * @param cronType Cron türü (Minutes, Hourly, Daily, etc.)
   */
  trackCronGeneration(cronType: string): void {
    this.trackEvent('cron_generated', {
      cron_type: cronType,
      event_category: 'cron_generator',
      event_label: 'cron_expression_generated'
    });
  }

  /**
   * Cron ifadesi kopyalama olayını gönderir
   */
  trackCronCopy(): void {
    this.trackEvent('cron_copied', {
      event_category: 'cron_generator',
      event_label: 'cron_expression_copied'
    });
  }

  /**
   * Sonraki tarihleri hesaplama olayını gönderir
   */
  trackNextDatesCalculation(): void {
    this.trackEvent('next_dates_calculated', {
      event_category: 'cron_calculator',
      event_label: 'next_dates_calculated'
    });
  }
} 