import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { EnquiryPayload, EnquiryResponse, PortfolioContent } from './portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getPortfolio(): Observable<PortfolioContent> {
    return this.http.get<PortfolioContent>(`${this.apiUrl}/portfolio`);
  }

  submitEnquiry(payload: EnquiryPayload): Observable<EnquiryResponse> {
    return this.http.post<EnquiryResponse>(`${this.apiUrl}/enquiries`, payload);
  }
}
