# JobBoard Pro

A modern Job Board SaaS platform built with Next.js 14, PayloadCMS 3.x, MongoDB Atlas, and Tailwind CSS. Connect Indian job seekers with their dream opportunities through an intuitive, feature-rich platform.

## 🚀 Features

### For Job Seekers
- **Advanced Search & Filtering**: Find jobs by title, location, category, experience level, and salary
- **Saved Jobs**: Bookmark and track interesting opportunities
- **User Dashboard**: Complete profile management with skills and experience
- **Subscription Plans**: Access premium features with flexible pricing
- **Email Notifications**: Stay updated with new job matches and application status

### For Companies
- **Job Posting**: Create detailed job listings with company information
- **Application Tracking**: Monitor candidate applications in real-time
- **Featured Listings**: Increase visibility for urgent or premium positions
- **Analytics Dashboard**: Track job performance and applicant metrics

### Platform Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure JWT-based authentication with PayloadCMS
- **Email System**: Automated emails with Resend (welcome, subscription, expiry reminders)
- **Cron Jobs**: Automated subscription management and expiry notifications
- **Mobile Responsive**: Optimized experience across all devices
- **SEO Friendly**: Server-side rendering with Next.js App Router

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Backend**: PayloadCMS 3.x, Node.js
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Authentication**: PayloadCMS JWT
- **Email**: Resend
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18.20.2 or higher
- pnpm 9 or higher
- MongoDB Atlas account
- Resend account (for emails)
- Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd job-board
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>"

# PayloadCMS
PAYLOAD_SECRET="<your-secret-key>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="<your-resend-api-key>"
RESEND_DEFAULT_FROM_EMAIL="noreply@jobboardpro.com"

# Cron Security
CRON_SECRET="<your-cron-secret>"

# Razorpay (for payments)
RAZORPAY_KEY_ID="<your-razorpay-key-id>"
RAZORPAY_KEY_SECRET="<your-razorpay-key-secret>"
```

### 4. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster (select the free tier)
3. Create a database user with read/write permissions
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)
5. Get your connection string and update `DATABASE_URL`

### 5. Resend Setup

1. Create a free Resend account
2. Get your API key from the dashboard
3. Add your API key to `RESEND_API_KEY`
4. Configure your domain and email settings

### 6. Run the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/         # Frontend routes
│   │   ├── page.tsx        # Homepage
│   │   ├── jobs/           # Jobs pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── about/          # About page
│   │   └── not-found.tsx   # 404 page
│   ├── (payload)/         # PayloadCMS admin
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication
│   │   ├── jobs/           # Jobs API
│   │   ├── payment/        # Payment API
│   │   └── cron/           # Cron jobs
│   ├── error.tsx           # Global error boundary
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Dashboard/          # Dashboard components
│   ├── Home/               # Homepage components
│   ├── Jobs/               # Job-related components
│   ├── Subscription/       # Subscription components
│   ├── Navbar.tsx          # Navigation
│   ├── Footer.tsx          # Footer
│   └── ui/                 # UI components
├── collections/            # PayloadCMS collections
│   ├── Users.ts            # User collection
│   ├── Jobs.ts             # Job collection
│   ├── SavedJobs.ts        # Saved jobs
│   └── Subscriptions.ts    # Subscriptions
├── lib/                   # Utility functions
│   ├── email.ts            # Email templates
│   ├── auth.ts             # Authentication helpers
│   └── mongodb.ts          # Database connection
├── scripts/                # Scripts
│   └── seed.ts             # Database seeding
├── types/                  # TypeScript types
│   ├── index.ts            # Main types
│   └── subscription.ts     # Subscription types
└── payload.config.ts       # PayloadCMS configuration
```

## 🌱 Database Seeding

To populate your database with sample data:

```bash
pnpm run seed
```

This will create 15 sample jobs with realistic Indian data, including:
- Various job categories (Technology, Design, Marketing, Finance, Healthcare, Education, Legal, Operations)
- Different job types (Full-time, Remote, Internship, Freelance)
- Multiple experience levels (Fresher to Manager)
- Realistic Indian company names (TCS, Infosys, Zomato, Swiggy, etc.)
- Proper salary ranges in INR
- Featured and urgent job markers

## 📧 Email Templates

The platform includes automated email templates for:

- **Welcome Email**: Sent when users register
- **Subscription Confirmation**: Sent when users subscribe
- **Expiry Reminder**: Sent 3 days before subscription expires
- **Subscription Expired**: Sent when subscription expires

All emails are mobile-responsive and include unsubscribe links.

## ⏰ Cron Jobs

The platform includes automated subscription management:

```bash
# Test the cron endpoint
curl -H "Authorization: Bearer <CRON_SECRET>" \
     https://your-app.vercel.app/api/cron/check-subscriptions
```

The cron job runs daily at 9 AM IST and:
- Updates expired subscriptions
- Sends expiry reminder emails
- Maintains subscription status

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Required Environment Variables on Vercel

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `CRON_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run integration tests
pnpm run test:int

# Run e2e tests
pnpm run test:e2e
```

## 📊 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm devsafe          # Clean start development server

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# PayloadCMS
pnpm payload          # Start PayloadCMS admin
pnpm generate:types   # Generate TypeScript types
pnpm generate:importmap # Generate import map

# Database
pnpm run seed         # Seed database with sample data
pnpm run seed:jobs    # Alternative seed command

# Code Quality
pnpm lint             # Run ESLint
pnpm generate:types   # Generate types (if schema changes)
```

## 🔧 Configuration

### PayloadCMS Configuration

The PayloadCMS configuration is in `src/payload.config.ts` and includes:

- MongoDB adapter
- Lexical rich text editor
- User authentication
- Custom collections (Users, Jobs, SavedJobs, Subscriptions)
- TypeScript generation
- Import map for custom components

### Tailwind CSS Configuration

The Tailwind configuration is in `tailwind.config.ts` and includes:

- Custom color palette
- Responsive breakpoints
- Component classes
- Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help:

- 📧 Email: support@jobboardpro.com
- 💬 Discord: [Join our community](https://discord.gg/jobboardpro)
- 📖 Documentation: [View our docs](https://docs.jobboardpro.com)
- 🐛 Issues: [Report a bug](https://github.com/your-username/job-board/issues)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI job matching
- [ ] Video interview platform
- [ ] Skill assessment tests
- [ ] Company branding pages
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [PayloadCMS](https://payloadcms.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Vercel](https://vercel.com/)
- Emails by [Resend](https://resend.com/)

---

Made with ❤️ in India for Indian professionals 🇮🇳