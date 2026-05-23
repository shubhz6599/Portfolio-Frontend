import { PortfolioContent } from './portfolio.models';

export const defaultPortfolio: PortfolioContent = {
  profile: {
    name: 'Shubham Karkhile',
    title: 'Senior Angular Developer',
    location: 'Pune, India',
    email: 'shubhz6599@gmail.com',
    phone: '+91 88880 52579',
    linkedin: 'https://www.linkedin.com/in/shubham-karkhile-a7aa52168/',
    github: 'https://github.com/shubhz6599',
    resumeUrl: 'assets/Shubham_Karkhile_Front_End_Developer_CV.pdf',
    summary:
      'Performance-driven Angular engineer building enterprise portals, MEAN-stack products, AI-enabled workflows, and high-traffic dashboards with a sharp focus on speed, accessibility, and maintainable architecture.'
  },
  metrics: [
    { value: '3.6+', label: 'years shipping', note: 'enterprise Angular and MEAN-stack products' },
    { value: '50k+', label: 'daily users', note: 'supplier portal scale and compliance' },
    { value: '30%', label: 'load time cut', note: 'OnPush, lazy loading, and reusable architecture' },
    { value: '25%', label: 'API latency cut', note: 'RxJS caching and communication tuning' }
  ],
  projects: [
    {
      slug: 'mahindra-supplier-portal',
      title: 'Mahindra Supplier Portal',
      role: 'Frontend Architecture Owner',
      summary:
        'Modern procurement and invoicing portal engineered with Angular standalone components, NgRx, Angular Material, and enterprise accessibility standards.',
      problem:
        'Supplier registration, invoicing, and procurement workflows needed consistency, speed, and compliance for a high-volume enterprise user base.',
      solution:
        'Designed a modular Angular architecture with lazy features, NgRx effects, typed service boundaries, OnPush change detection, and reusable workflow components.',
      impact:
        'Improved load time by 30%, increased component reuse by 40%, and helped keep deployed features aligned with enterprise security and accessibility requirements.',
      metrics: [
        { value: '50k+', label: 'daily users', note: 'enterprise portal usage' },
        { value: '30%', label: 'faster loads', note: 'measured frontend optimization' },
        { value: '40%', label: 'reuse lift', note: 'shared component architecture' }
      ],
      stack: ['Angular 16+', 'Standalone Components', 'NgRx', 'RxJS', 'Angular Material', 'a11y'],
      featured: true,
      links: {}
    },
    {
      slug: 'icici-lombard-insurance',
      title: 'ICICI Lombard Insurance Workbench',
      role: 'Frontend Engineer',
      summary:
        'High-traffic health and motor insurance dashboards with OTP validation, policy search, dynamic add-on selection, quote generation, and eKYC flows.',
      problem:
        'Agents and admins needed secure, fast workflows across policy lookup, customer validation, quote creation, and certificate generation.',
      solution:
        'Implemented reactive forms, custom validators, RxJS streams, CERSAI eKYC integration, and optimized HTTP caching for dashboard-heavy experiences.',
      impact:
        'Reduced API latency by 25% and delivered reliable dashboards for policy analytics and automated certificate generation.',
      metrics: [
        { value: '25%', label: 'latency drop', note: 'HTTP and RxJS optimization' },
        { value: 'OTP', label: 'secure flows', note: 'customer verification' },
        { value: 'eKYC', label: 'identity checks', note: 'CERSAI integration' }
      ],
      stack: ['Angular', 'Reactive Forms', 'RxJS', 'CERSAI APIs', 'Dashboards', 'SASS'],
      featured: true,
      links: {}
    },
    {
      slug: 'itrendss-ecommerce-platform',
      title: 'iTrendss E-Commerce Platform',
      role: 'Full-stack Developer',
      summary:
        'Production-grade commerce platform with user/admin panels, JWT authentication, Razorpay payments, MongoDB persistence, and email notifications.',
      problem:
        'The product needed a reliable commerce stack that could handle storefront browsing, admin controls, secure transactions, and customer communication.',
      solution:
        'Built a MEAN-stack architecture with Angular, Node.js, Express, MongoDB, JWT sessions, Razorpay checkout, and Nodemailer delivery events.',
      impact:
        'Delivered a scalable live commerce system with automated order and delivery status notifications.',
      metrics: [
        { value: 'JWT', label: 'auth', note: 'secure user and admin flows' },
        { value: 'Razorpay', label: 'payments', note: 'transaction handling' },
        { value: 'MongoDB', label: 'storage', note: 'product and order data' }
      ],
      stack: ['Angular', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Razorpay', 'Nodemailer'],
      featured: true,
      links: {}
    }
  ],
  skills: [
    {
      name: 'Angular Core',
      signal: 'Interface systems',
      tools: ['Angular 2+', 'Angular 17+', 'Standalone Components', 'Signals', 'OnPush', 'Dependency Injection']
    },
    {
      name: 'Reactive State',
      signal: 'Data movement',
      tools: ['RxJS', 'NgRx Store', 'Effects', 'Selectors', 'BehaviorSubject', 'switchMap', 'takeUntil']
    },
    {
      name: 'Full Stack',
      signal: 'Product delivery',
      tools: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT', 'Postman']
    },
    {
      name: 'Integrations',
      signal: 'Business workflows',
      tools: ['Razorpay', 'Twilio', 'CERSAI eKYC', 'OpenAI APIs', 'Gemini APIs', 'ElevenLabs']
    },
    {
      name: 'Quality',
      signal: 'Production readiness',
      tools: ['Jasmine', 'Karma', 'TestBed', 'Accessibility', 'GitHub Actions', 'Agile/Scrum']
    }
  ],
  experiences: [
    {
      company: 'Digital Crown IT Systems',
      location: 'Mumbai, India',
      role: 'Angular Developer',
      period: 'Dec 2024 - Present',
      highlights: [
        'Modernized procurement and invoicing workflows for Mahindra & Mahindra Supplier Portal.',
        'Built NgRx-backed state layers for complex supplier registration modules.',
        'Integrated Twilio and OpenAI/Gemini chatbot workflows for real-time voice and text communication.'
      ]
    },
    {
      company: 'Setu Net Pvt. Ltd.',
      location: 'Vapi, India',
      role: 'Jr. Full-stack Developer',
      period: 'Mar 2024 - Jul 2024',
      highlights: [
        'Migrated core enterprise applications from Angular 6 to Angular 11.',
        'Resolved RxJS and Angular Material breaking changes across legacy modules.',
        'Mentored junior developers on TypeScript, DI, and modular architecture.'
      ]
    },
    {
      company: 'One Roof Technologies LLP',
      location: 'Mumbai, India',
      role: 'Software Developer',
      period: 'Aug 2022 - Jan 2024',
      highlights: [
        'Built ICICI Lombard health and motor insurance dashboards.',
        'Implemented policy search, OTP validation, quote flows, add-ons, and CERSAI eKYC.',
        'Reduced API latency through optimized RxJS communication and caching strategies.'
      ]
    },
    {
      company: 'Techivies Solutions Pvt. Ltd.',
      location: 'Ahmedabad, India',
      role: 'Full-stack Developer Intern',
      period: 'Feb 2022 - Aug 2022',
      highlights: [
        'Contributed to a MEAN-stack Supplier Relationship Management project.',
        'Built responsive UI layouts and integrated REST APIs for a US-based client.'
      ]
    }
  ],
  services: [
    {
      title: 'Website Development',
      tagline: 'Built for conversion and speed',
      description:
        'Responsive, SEO-aware frontends and lean Angular experiences tailored for modern businesses. Every website is built to perform with fast load times, scalable structure, and clear user journeys.',
      approach:
        'We begin with a discovery session, translate your goals into an information hierarchy, then deliver a modular website with reusable components, clean animations, and fast deployment so your digital storefront feels premium and polished.'
    },
    {
      title: 'Digital Marketing',
      tagline: 'Visibility that drives leads',
      description:
        'Data-driven marketing strategies designed for IT service brands. We combine keyword research, performance analytics, and campaign messaging to attract qualified traffic and improve conversion potential.',
      approach:
        'We audit your current digital footprint, map the ideal customer journey, and run targeted campaigns using search engines, technical SEO, and analytics feedback so your marketing investment scales sustainably.'
    },
    {
      title: 'Social Media Marketing',
      tagline: 'Strategic presence across channels',
      description:
        'Branded content and engagement workflows for LinkedIn, Instagram, and Facebook that amplify your service expertise. We focus on consistent storytelling, real-world results, and trust-building assets.',
      approach:
        'We craft a tailored content calendar, produce shareable messaging, and optimize each platform around audience signals so your IT services brand builds recognition and meaningful leads online.'
    },
    {
      title: 'Marketing Automation',
      tagline: 'From interest to inquiry',
      description:
        'Pipeline-ready automation for lead capture, email nurture, and follow-up sequences. We connect your website ecosystem to CRM and messaging so every inquiry is handled consistently and professionally.',
      approach:
        'We implement lead forms, email flows, and reporting dashboards that move prospects through awareness, consideration, and decision stages with clarity and measurable outcomes.'
    }
  ]
};
