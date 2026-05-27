// ================================================================
// chatbot.component.ts
// Shubham's Assistant — session-only, no persistence
//
// Session lifetime = browser tab lifetime (in-memory only).
// No localStorage / sessionStorage used — fresh start on every
// page load or tab close.
// ================================================================
import {
  Component, AfterViewChecked, OnDestroy,
  signal, computed, inject, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ChatbotService, ChatMessage, AiResponseType } from './chatbotServices/chatbot.service';

type ChatPhase = 'idle' | 'sending';

// ── Quick-reply chips shown on the welcome screen ────────────────
const QUICK_REPLIES: string[] = [
  // 'Services you offer?',
  'Hello! Who Are You?',
  'What is AI?',
  'Who is prime minister of india?',
];

// ── Welcome message (assistant, shown at session start) ──────────
function makeWelcome(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hi! I'm **Shubham's personal assistant**. I can tell you all about his Angular expertise, projects, experience, and services.\n\nWhat would you like to know?",
    timestamp: new Date(),
  };
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('msgList')  private msgListRef!: ElementRef<HTMLElement>;
  @ViewChild('inputRef') private inputRef!:   ElementRef<HTMLInputElement>;

  private readonly svc = inject(ChatbotService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── UI signals ─────────────────────────────────────────────────
  protected readonly isOpen          = signal(false);
  protected readonly phase           = signal<ChatPhase>('idle');
  protected readonly inputText       = signal('');
  protected readonly hasNotification = signal(true);

  // ── Session-only message store (plain in-memory array) ─────────
  // Never written to localStorage / sessionStorage / IndexedDB.
  // Garbage-collected when the tab is closed.
  protected readonly messages = signal<ChatMessage[]>([makeWelcome()]);

  protected readonly showQuickReplies = computed(
    () => this.messages().length <= 1 && this.phase() === 'idle'
  );

  private _shouldScroll = false;

  // ── Lifecycle ──────────────────────────────────────────────────
  ngAfterViewChecked(): void {
    if (this._shouldScroll) {
      this._scrollToBottom();
      this._shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    // No cleanup needed — messages live only in this component instance
  }

  // ── FAB / panel controls ───────────────────────────────────────
  protected toggleChat(): void {
    this.isOpen.update(v => !v);
    this.hasNotification.set(false);
    if (this.isOpen()) {
      setTimeout(() => this.inputRef?.nativeElement.focus(), 140);
    }
  }

  protected closeChat(): void {
    this.isOpen.set(false);
  }

  protected useQuickReply(text: string): void {
    this.inputText.set(text);
    this._submit();
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._submit();
    }
  }

  protected sendMessage(): void {
    this._submit();
  }

  // ── Core send logic ────────────────────────────────────────────
  private _submit(): void {
    const text = this.inputText().trim();
    if (!text || this.phase() === 'sending') return;

    // 1. Add user bubble
    this.messages.update(m => [
      ...m,
      { id: this._uid(), role: 'user', content: text, timestamp: new Date() },
    ]);
    this.inputText.set('');
    this.phase.set('sending');
    this._shouldScroll = true;

    // 2. Add typing indicator
    const typingId = this._uid();
    this.messages.update(m => [
      ...m,
      { id: typingId, role: 'assistant', content: '', timestamp: new Date(), isTyping: true },
    ]);
    this._shouldScroll = true;
    this.cdr.markForCheck();

    // 3. Hit Node.js API
    this.svc.ask(text).pipe(take(1)).subscribe({
      next: (res) => {
        // res.data.type is 'portfolio_answer' | 'global_answer'
        // res.data.answer is the text (may include the "not related" prefix for global)
        this.messages.update(m =>
          m.map(msg =>
            msg.id === typingId
              ? {
                  ...msg,
                  content: res.data.answer,
                  isTyping: false,
                  responseType: res.data.type,
                }
              : msg
          )
        );
        this.phase.set('idle');
        this._shouldScroll = true;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.messages.update(m =>
          m.map(msg =>
            msg.id === typingId
              ? {
                  ...msg,
                  content: err.message || 'Something went wrong. Please try again.',
                  isTyping: false,
                  responseType: undefined,
                }
              : msg
          )
        );
        this.phase.set('idle');
        this._shouldScroll = true;
        this.cdr.markForCheck();
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────

  /** Reset to fresh welcome state (same session, just clear messages). */
  protected clearChat(): void {
    this.messages.set([makeWelcome()]);
    this.phase.set('idle');
    this.inputText.set('');
    this._shouldScroll = true;
    setTimeout(() => this.inputRef?.nativeElement.focus(), 60);
  }

  protected formatTime(d: Date): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Minimal safe markdown renderer.
   * Handles: **bold**, _italic_, `code`, numbered/bullet lists, newlines.
   * Does NOT use innerHTML for user messages — only assistant bubbles.
   */
  protected renderMarkdown(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  // ── Private ────────────────────────────────────────────────────
  private _scrollToBottom(): void {
    const el = this.msgListRef?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  private _uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // Expose for template
  protected readonly quickReplies = QUICK_REPLIES;
}
