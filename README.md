# Etomovich Journal App

A full-stack personal journaling application built with Next.js, Prisma, NextAuth, Tailwind CSS, and AI-powered features. This app demonstrates technical leadership through a robust feature set including:

- **User Authentication:**  
  Supports Google OAuth and credentials-based login using NextAuth and Prisma.

- **Journal Entry Management:**  
  Create, edit, view, and soft-delete journal entries. Each entry can be associated with multiple categories and tags.

- **Categorization & Tagging:**  
  Manage categories and tags through dedicated pages, associate them with journal entries, and filter journals by category or tag.

- **Analytics & Visualization:**  
  Visualize journal insights such as category distribution and monthly entry frequency using Chart.js and react-chartjs-2.

- **AI-Powered Analysis:**  
  Analyze journal entries for sentiment, key themes, and receive writing suggestions using the OpenAI API.

- **Settings & Profile Management:**  
  Update your profile and change your password through a dedicated settings page.

---

## Getting Started

### Deployed project link

Here is the project deployed link [https://etomovich-journal-app.vercel.app/](https://etomovich-journal-app.vercel.app/)

### System design documents

Here is a link where you can get the [system documentation](https://github.com/EtoleJames/etomovich-journal-app/tree/main/docs)


### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/etomovich-journal-app.git
   cd etomovich-journal-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

Create a `.env.local` file in the project root and add your configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/etomovich_journal?schema=public
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="Your App <no-reply@example.com>"
```

3. **Run Prisma Migrations & Generate Client:**

```
npx prisma migrate dev --name init
npx prisma generate
```

4. **Start the Development Server:**
```
npm run dev
```

5. **Access the Application:**

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Project File Structure

```
    etomovich-journal-app/
├── node_modules/
├── prisma/
│   └── schema.prisma                  # Prisma schema file defining User, JournalEntry, 
├── public/
│   └── images/
│       └── logo/
│           └── logo.svg               # Application logo
├── src/
│   ├── app/
│   │   ├── analytics/
│   │   │   └── page.tsx               # Analytics & Visualization page
│   │   ├── ai/
│   │   │   └── analyze/
│   │   │       └── page.tsx           # AI Analysis page
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── analyze/
│   │   │   │       └── route.ts       # AI analysis API endpoint
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts       # NextAuth API endpoint (Google & Credentials)
│   │   │   ├── change-password/
│   │   │   │   └── route.ts           # Change Password API endpoint
│   │   │   ├── categories/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts       # PUT & DELETE endpoints for individual category
│   │   │   │   └── route.ts           # GET & POST endpoints for categories
│   │   │   ├── journal/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx   # Edit Journal Entry page
│   │   │   │   │   └── page.tsx       # Journal Detail page
│   │   │   │   └── route.ts           # GET & POST endpoints for journal entries
│   │   │   └── tags/
│   │   │       ├── [id]/
│   │   │       │   └── route.ts       # PUT & DELETE endpoints for individual tag
│   │   │       └── route.ts           # GET & POST endpoints for tags
│   │   ├── change-password/
│   │   │   └── page.tsx               # Change Password UI page
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard page with quick links and recent entries
│   │   ├── forgot-password/
│   │   │   └── page.tsx               # Forgot Password page for password reset request
│   │   ├── journal/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx       # Edit Journal Entry page
│   │   │   │   └── page.tsx           # Journal Detail page
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # New Journal Entry page (with optional AI analysis integration)
│   │   │   └── page.tsx               # Journal List page
│   │   ├── profile/
│   │   │   └── page.tsx               # Profile details page
│   │   ├── register/
│   │   │   └── page.tsx               # Register (Sign Up) page
│   │   ├── settings/
│   │   │   └── page.tsx               # Settings & Profile Management page
│   │   ├── sign-in/
│   │   │   └── page.tsx               # Sign In page (supports Google and Credentials)
│   │   └── layout.tsx                 # Root layout with ThemeProvider and global styles
│   ├── components/
│   │   ├── Header.tsx                 # Header component with multi-level dropdown support
│   │   ├── ThemeToggler.tsx           # Component to toggle light/dark themes
│   │   └── ... (other UI components)
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client instance
│   │   ├── mailer.ts                  # Nodemailer-based email helper for password resets
│   │   └── utils.ts                   # Utility functions (e.g., class merging)
│   └── types/
│       └── menu.ts                    # Type definitions for menu items
├── .env.local                         # Environment variables (DB, OpenAI, NextAuth, SMTP, etc.)
├── next.config.js                     # Next.js configuration
├── package.json                       # Project package file (dependencies, scripts)
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file

```

---

## Features

- **User Authentication:**  
  NextAuth with Google and credentials providers, using Prisma for user management.

- **Journal Management:**  
  Create, edit, view, and soft-delete journal entries with association to categories and tags.

- **Categorization & Tagging:**  
  Manage categories and tags through dedicated pages; filter journal entries by category or tag.

- **Analytics & Visualization:**  
  Visualize journal insights such as category distribution and monthly entry frequency with Chart.js and react-chartjs-2.

- **AI-Powered Analysis:**  
  Analyze journal entries for sentiment, key themes, and receive writing suggestions using the OpenAI API.

- **Settings & Profile Management:**  
  Update your profile information and change your password.

---

## Usage

After completing the installation steps, run the development server:

```bash
npm run dev
```

Then navigate to [http://localhost:3000](http://localhost:3000) in your browser to begin using the application.

---

## License

This project is licensed under the MIT License.
