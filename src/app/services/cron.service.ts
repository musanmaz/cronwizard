import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CronService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  generateCron(interval: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-cron`, { interval });
  }
}
