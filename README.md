# Leads Management System

A Next.js application for managing leads with a public submission form and an internal dashboard.

## Features

- Public lead submission form with file upload
- Protected internal dashboard for lead management
- Form validation and error handling
- Responsive design
- Mock authentication system

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hook Form with Zod validation
- Mock API endpoints (can be replaced with real backend)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Public Form
- Visit the homepage to access the public lead submission form
- Fill in all required fields and upload a resume
- Submit the form to create a new lead

### Internal Dashboard
- Access the internal dashboard through the following steps:
  1. Visit `/login` in your browser
  2. Use the following mock credentials:
     - Email: `admin@example.com`
     - Password: `admin123`
  3. After successful login, you'll be automatically redirected to `/dashboard`
  4. The dashboard allows you to:
     - View all submitted leads in a table format
     - See complete lead information (contact details, visa preferences, etc.)
     - Download submitted resumes
     - Update lead status from PENDING to REACHED_OUT
     - View detailed information for each lead

Note: The system uses a mock authentication system. Sessions are managed through cookies and protected by middleware.

## Development

### Project Structure
```
src/
  ├── app/
  │   ├── api/         # API routes
  │   ├── dashboard/   # Protected dashboard
  │   ├── login/       # Authentication
  │   └── page.tsx     # Public form
  ├── components/      # Reusable components
  └── middleware.ts    # Auth middleware
```

### API Routes
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Retrieve all leads (protected)

## Notes

This is a demo application with mock authentication and in-memory data storage. For production use:

1. Implement proper authentication (e.g., NextAuth.js)
2. Add a database for persistent storage
3. Set up proper file storage for resumes
4. Add error logging and monitoring
5. Implement rate limiting and security measures
