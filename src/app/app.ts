import { Component, OnInit, AfterViewInit, computed, inject, signal, HostListener } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { defaultPortfolio } from './portfolio-data';
import { PortfolioApiService } from './portfolio-api.service';
import { DOCUMENT } from '@angular/common';
import { ChatbotComponent } from './chatbot/chatbot';


@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {
  private readonly api = inject(PortfolioApiService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly content = signal(defaultPortfolio);
  protected readonly apiState = signal<'loading' | 'live' | 'fallback'>('loading');
  protected readonly activeProjectSlug = signal(defaultPortfolio.projects[0].slug);
  protected readonly formState = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  protected readonly formMessage = signal('');
  private _toastTimeout?: ReturnType<typeof setTimeout>;
  protected readonly year = new Date().getFullYear();
  private readonly _doc = inject(DOCUMENT);
  private _revealObserver!: IntersectionObserver;

  protected readonly activeProject = computed(() => {
    return (
      this.content().projects.find((project) => project.slug === this.activeProjectSlug()) ??
      this.content().projects[0]
    );
  });

  protected readonly enquiryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    phone: ['', [Validators.maxLength(24), Validators.pattern(/^[+0-9\s()-]*$/)]],
    company: ['', [Validators.maxLength(120)]],
    projectType: ['Enterprise Angular build', [Validators.required]],
    budget: ['Discovery first'],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1800)]],
    consent: [false, [Validators.requiredTrue]],
    website: ['']
  });

  protected readonly projectTypes = [
    'Enterprise Angular build',
    'Portfolio / website',
    'MEAN-stack product',
    'Dashboard / admin portal',
    'API integration',
    'Performance review'
  ];

  protected readonly budgetRanges = [
    'Discovery first',
    'Under INR 50k',
    'INR 50k - 1.5L',
    'INR 1.5L - 4L',
    'INR 4L+'
  ];

  ngOnInit(): void {
    this.api
      .getPortfolio()
      .pipe(take(1))
      .subscribe({
        next: (portfolio) => {
          this.content.set({
            profile: portfolio.profile ?? defaultPortfolio.profile,
            metrics: portfolio.metrics?.length ? portfolio.metrics : defaultPortfolio.metrics,
            projects: portfolio.projects?.length ? portfolio.projects : defaultPortfolio.projects,
            skills: portfolio.skills?.length ? portfolio.skills : defaultPortfolio.skills,
            experiences: portfolio.experiences?.length ? portfolio.experiences : defaultPortfolio.experiences,
            services: portfolio.services?.length ? portfolio.services : defaultPortfolio.services
          });
          this.activeProjectSlug.set(this.content().projects[0].slug);
          this.apiState.set('live');
        },
        error: () => {
          this.apiState.set('fallback');
        }
      });
  }

  ngAfterViewInit(): void {
    // small delay to ensure DOM nodes are present
    setTimeout(() => {
      this._setupRevealObserver();
      this._setupScrolledTopbar();
      this._setupHamburger();
    }, 80);
  }
  private _setupHamburger(): void {
    const toggle = this._doc.querySelector<HTMLButtonElement>('#navToggle');
    const nav = this._doc.querySelector<HTMLElement>('#primaryNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close drawer when user clicks outside
    this._doc.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!nav.contains(target) && !toggle.contains(target)) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close drawer on Escape
    this._doc.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.closeNav();
    });
  }

  private setupRevealObserver(): void {
    try {
      const selector = 'section, .case-file, .metric-strip article, .skill-node, .timeline article, .hero-copy, .operator-panel';
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      elements.forEach((el) => observer.observe(el));
    } catch (e) {
      // fail silently if DOM is not available (e.g., server render)
    }
  }

  protected selectProject(slug: string): void {
    this.activeProjectSlug.set(slug);
  }

  protected submitEnquiry(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      this.formState.set('error');
      this.formMessage.set('Please complete the highlighted fields before sending.');
      return;
    }

    this.formState.set('sending');
    this.formMessage.set('Sending your enquiry...');
    console.log(this.enquiryForm.getRawValue());

    this.api
      .submitEnquiry(this.enquiryForm.getRawValue())
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.formState.set('sent');
          this._showToast(`${response.message} Reference: ${response.enquiryId}`);
          this.enquiryForm.reset({
            name: '',
            email: '',
            phone: '',
            company: '',
            projectType: 'Enterprise Angular build',
            budget: 'Discovery first',
            message: '',
            consent: false,
            website: ''
          });
        },
        error: (error) => {
          this.formState.set('error');
          this._showToast(
            error?.error?.message ??
            'The enquiry could not be sent right now. Please email me directly.'
          );
        }
      });
  }

  protected isInvalid(controlName: keyof typeof this.enquiryForm.controls): boolean {
    const control = this.enquiryForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  private _showToast(message: string): void {
    this.formMessage.set(message);
    if (this._toastTimeout) {
      clearTimeout(this._toastTimeout);
    }
    this._toastTimeout = setTimeout(() => {
      this.formMessage.set('');
      this._toastTimeout = undefined;
    }, 5000);
  }

  protected clearToast(): void {
    this.formMessage.set('');
    if (this._toastTimeout) {
      clearTimeout(this._toastTimeout);
      this._toastTimeout = undefined;
    }
  }

  private _setupRevealObserver(): void {
    const options: IntersectionObserverInit = {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    };

    this._revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after first reveal for performance
          this._revealObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all reveal targets
    const targets = this._doc.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .stagger'
    );
    targets.forEach((el) => this._revealObserver.observe(el));
  }

  // ── Topbar shadow on scroll ────────────────────────────────
  private _setupScrolledTopbar(): void {
    const topbar = this._doc.querySelector<HTMLElement>('.topbar');
    if (!topbar) return;

    const onScroll = () => {
      topbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on init
  }

  // ── Cleanup ────────────────────────────────────────────────
  ngOnDestroy(): void {
    this._revealObserver?.disconnect();
  }
  protected closeNav(): void {
    const nav = this._doc.querySelector<HTMLElement>('nav');
    const toggle = this._doc.querySelector<HTMLButtonElement>('.nav-toggle');
    nav?.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}
