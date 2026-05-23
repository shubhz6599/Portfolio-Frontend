import { Component, OnInit, AfterViewInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { defaultPortfolio } from './portfolio-data';
import { PortfolioApiService } from './portfolio-api.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
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
  protected readonly year = new Date().getFullYear();

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
    setTimeout(() => this.setupRevealObserver(), 60);
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
          this.formMessage.set(`${response.message} Reference: ${response.enquiryId}`);
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
          this.formMessage.set(
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
}
