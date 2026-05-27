// ================================================================
// chatbot.service.ts
// Matches your Node.js API exactly:
//   POST /api/chat  { question, confirmedGlobal }
//   → { success, data: { type, answer }, timestamp }
//
// AiResponse types (updated):
//   | { type: 'portfolio_answer'; answer: string }
//   | { type: 'global_answer';    answer: string }
// ================================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


// ── Mirrors the Node.js AiResponse union exactly ─────────────────
export type AiResponseType = 'portfolio_answer' | 'global_answer';

export interface NodeApiRequest {
  question: string;
  confirmedGlobal: boolean;
}

export interface NodeApiResponse {
  success: boolean;
  data: {
    type: AiResponseType;
    answer: string;
  };
  timestamp: string;
}

// ── What the Angular component works with internally ─────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;   // true while awaiting API response
  responseType?: AiResponseType;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly http = inject(HttpClient);

  // Set in environment.ts  e.g. chatApiUrl: 'http://localhost:3000'
  private readonly baseUrl = (environment as any).apiUrl ;
  private readonly endpoint = `${this.baseUrl}/ai/chat`;

  /**
   * Send a question to the Node.js chatbot.
   * confirmedGlobal is always false from Angular — the backend
   * now auto-answers globally instead of prompting for confirmation.
   */
  ask(question: string): Observable<NodeApiResponse> {
    const payload: NodeApiRequest = {
      question,
      confirmedGlobal: false,
    };

    return this.http
      .post<NodeApiResponse>(this.endpoint, payload)
      .pipe(catchError(this._handleError));
  }

  private _handleError(err: HttpErrorResponse): Observable<never> {
    const msg =
      err.error?.message ??
      err.error?.error ??
      'Connection failed. Please try again in a moment.';
    return throwError(() => new Error(msg));
  }
}
