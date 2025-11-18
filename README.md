# WholesaleOS Elite

AI-powered real estate wholesaling platform that automatically monitors markets, scores properties, and alerts users to high-value deals.

## Features

- **Automated Market Monitoring**: Hourly scans of real estate listings
- **AI Property Scoring**: Investment potential scoring (0-100)
- **Smart Alerts**: Email notifications for high-score deals
- **24 Smart Presets**: Pre-configured search strategies
- **Advanced Filtering**: 100+ property tags and filters
- **Dashboard**: Clean, modern UI for managing properties and markets

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Postgres
- **Python**: Serverless functions for scraping (HomeHarvest Elite)
- **Auth**: NextAuth.js v5
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- Vercel Postgres database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wholesale-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables in `.env.local`.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

Run the migration scripts in `/sql/migrations/` in order:
```bash
# Connect to your Vercel Postgres database and run each migration
```

## Project Structure

```
wholesale-os/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── db/               # Database queries
│   └── auth.ts           # Auth configuration
├── sql/                   # Database migrations
└── api/                   # Python serverless functions
    └── python/
        ├── scrape.py
        └── score.py
```

## Development Workflow

1. Create feature branch from `develop`
2. Implement feature
3. Test locally
4. Create PR to `develop`
5. Deploy preview on Vercel
6. Merge to `develop` after review
7. Merge `develop` to `main` for production

## Deployment

This project is designed to deploy on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

## License

Proprietary - All rights reserved

## Support

For support, contact [your-email]
