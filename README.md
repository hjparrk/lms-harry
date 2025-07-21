# Simplified LMS Assessment - Harry Park

## 🎯 Assessment Requirements

This project fulfills the following requirements:

-   **Student Authentication**: Secure login system
-   **Dashboard Interface**: View upcoming lessons and learning progress
-   **Lesson Completion**: Mark lessons as complete with progress tracking
-   **Technology Stack**: Next.js, TypeScript, and Supabase
-   **Visual Design**: Inspired by Contour Education's TestPrep platform

## ✅ Features Implemented

-   🔐 **Student Authentication System**

    -   Secure email/password login with Supabase Auth
    -   Protected routes with middleware authentication
    -   Automatic session management and redirects

-   📊 **Interactive Dashboard**

    -   Learning statistics overview (total, in-progress, completed courses)
    -   Course enrollment display with progress tracking
    -   Responsive design with modern UI components

-   📚 **Course & Lesson Management**

    -   Hierarchical structure: Courses → Sections → Lessons
    -   Real-time lesson completion tracking
    -   Progress synchronization across components

-   🎨 **Modern UI/UX**

    -   Responsive design with Tailwind CSS v4
    -   Professional visual design with gradient headers
    -   Mobile-friendly responsive layout

-   🔒 **Security & Data Integrity**
    -   Row Level Security (RLS) policies in Supabase
    -   Type-safe database operations with TypeScript
    -   Error handling with Result pattern

## 🏗️ Technical Architecture

### Frontend Stack

-   **Next.js 15.4.2** with App Router pattern
-   **React 19.1.0** with Server Components and Client Components
-   **TypeScript** with strict mode for type safety
-   **Tailwind CSS v4** for styling
-   **Zod** for schema & form validation

### Backend & Database

-   **Supabase** for authentication and database
-   **Row Level Security (RLS)** for data protection
-   **Server Actions** for form handling and mutations

## 🗃️ Database Schema

The application uses a relational database structure with the following key tables:

### Core Tables

```sql
-- User profiles with role-based access
profiles (id, email, full_name, role, created_at, updated_at)

-- Course catalog
courses (id, title, description, is_active, total_lessons, created_at, updated_at)

-- Course sections for content organization
sections (id, course_id, title, order_index, created_at)

-- Individual lessons within sections
lessons (id, section_id, title, content, content_type, order_index, created_at)

-- Student course enrollments
enrollments (id, student_id, course_id, enrolled_at, completed_lessons, last_accessed_lesson_id, progress)

-- Detailed lesson completion tracking
lesson_progress (id, student_id, lesson_id, completed_at, created_at)
```

### Security Features

-   **Row Level Security (RLS)** enabled on all tables
-   **Student data isolation** - users can only access their own data
-   **Secure authentication** with Supabase Auth integration

## 🚀 Setup & Installation

### Prerequisites

-   **Node.js 18+** and npm
-   **Supabase account** ([supabase.com](https://supabase.com))
-   **Git** for version control

### Environment Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/hjparrk/lms-harry.git
    cd lms-harry
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. **Set up Supabase database**

    - Create a new Supabase project (Sydney Region)
    - Copy your project URL and anon key to `.env.local`
    - Run the database setup script in Supabase SQL Editor:
        1. Copy the contents of `SQL/supabase-setup.sql` and run in Supabase SQL Editor
        2. (Optional) For sample data: Create a user in Authentication > Users, then copy the contents of `SQL/sample-data-generation.sql` and run it (remember to replace `YOUR_USER_ID_HERE` with your actual user ID)

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open the application**

    Navigate to [http://localhost:3000](http://localhost:3000)

### Sample Data

The setup script includes sample courses and lessons for testing.

## 📖 Usage Instructions

### User Flow

1. **Access the Application**: Navigate to the home page
2. **Authentication**: Use the login form
3. **Dashboard**: View your learning statistics and enrolled courses
4. **Course Navigation**: Click on a course to view its structure
5. **Lesson Completion**: Navigate through lessons and mark them as complete
6. **Progress Tracking**: Watch your progress update in real-time

### Key Pages

-   `/` - Landing page with login redirect
-   `/login` - Authentication form
-   `/dashboard` - Main student dashboard (protected)
-   `/courses/[courseId]` - Course overview with lesson sidebar (protected)
-   `/courses/[courseId]/lessons/[lessonId]` - Individual lesson view (protected)

## 📁 Project Structure

```
src/
├── actions/              # Server Actions for form handling
│   ├── auth.ts          # Authentication actions
│   └── courses.ts       # Course-related mutations
├── app/                 # Next.js App Router structure
│   ├── (auth)/          # Authentication route group
│   ├── (protected)/     # Protected routes (requires login)
│   ├── (public)/        # Public routes
│   └── auth/            # Auth callback routes
├── components/          # UI components
│   ├── auth/            # Authentication components
│   ├── courses/         # Course-related components
│   ├── dashboard/       # Dashboard components
│   └── layout/          # Global Layout components
├── contexts/            # React Context providers
├── lib/                 # Business logic and data fetching
├── schemas/             # Zod validation schemas
├── types/               # TypeScript type & interface definitions
└── utils/               # Utility functions and Supabase clients
```

### Route Organization

-   **Route Groups**: `(auth)`, `(protected)`, `(public)` for logical organization
-   **Dynamic Routes**: `[courseId]` and `[lessonId]` for parameterized content
-   **Middleware Protection**: Authentication check on protected routes

## 🛠️ Technical Architecture & Backend Logic

For detailed information about backend logic, technical decisions, and implementation details, see:

📖 **[TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)**

This document covers:

-   Server Actions architecture and data layer design
-   Security considerations and performance optimizations
-   Database schema decisions and RLS implementation
-   Error handling strategies and type safety patterns
-   Deployment considerations and scalability planning

## 🏗️ Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🎯 Assessment Deliverables Checklist

-   ✅ **Frontend in Next.js**: Modern React application with App Router
-   ✅ **Backend Logic**: Server Actions, data layer, and business logic
-   ✅ **README with setup/run instructions**: Comprehensive documentation
-   ✅ **Supabase Integration**: Complete database schema and sample data
-   🔲 **CI/CD Setup**: Optional GitHub Actions (can be added if needed)

---

**Built with ❤️ for Contour Education's Take-Home Assessment**

_This project demonstrates full-stack development capabilities using modern web technologies and best practices._
