# 📝 Complaint Register System

A full-stack complaint management system built using **Next.js**, **TypeScript**, **MongoDB**, and **Nodemailer**.  
The application allows users to submit complaints and enables administrators to manage and track them through a secure admin dashboard.

---

## 🚀 Features

### 👤 User (Public)
- Submit a complaint with:
  - Complaint Title
  - Description
  - Category
  - Priority
- Simple and clean complaint submission flow
- No authentication required for users

### 🛠 Admin
- Secure admin authentication using **JWT (HTTP-only cookies)**
- Admin dashboard to:
  - View all complaints (paginated)
  - View individual complaint details
  - Update complaint status (`Pending`, `In Progress`, `Resolved`)
- Email notifications:
  - When a new complaint is submitted
  - When a complaint status is updated
- Admins are restricted from submitting complaints

---

## 🧱 Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with HTTP-only cookies
- **Email Service**: Nodemailer (SMTP)
- **Package Manager**: pnpm

---

## 📁 Project Structure (Simplified)

```txt
app/
├─ page.tsx
├─ complaint/
│  └─ register/
│     ├─ page.tsx
│     └─ ComplaintRegisterClient.tsx
├─ admin/
│  ├─ login/
│  ├─ register/
│  └─ main/
│     ├─ dashboard/
│     └─ complaints/
│        └─ [id]/
├─ api/
│  ├─ complaints/
│  └─ admin/
│     ├─ login
│     ├─ logout
│     ├─ emails
│     └─ complaints/
│        └─ [id]
lib/
├─ mongodb.ts
├─ mailer.ts
└─ auth/
models/
├─ Complaint.ts
└─ Admin.ts
middleware.ts

```

## 🔐 Authentication & Authorization

- Admin authentication is handled using **JWT**
- Token is stored in an **HTTP-only cookie**
- Route protection is enforced using **Next.js middleware**
- Role-based access control:
  - **Admin routes** → accessible only by admins
  - **Complaint submission** → accessible only by non-admin users

---

## 📬 Email Notifications

Email notifications are implemented using **Nodemailer**:

- 📧 **New complaint submission** → email sent to all admins
- 📧 **Complaint status update** → email sent to all admins

Admin email addresses are fetched through an internal API to maintain centralized authorization logic.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string

ADMIN_JWT_SECRET=your_jwt_secret_key

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

APP_URL=http://localhost:3000

```

## ▶️ Running the Application Locally
```txt
pnpm install
pnpm dev

// The application will be available at:

http://localhost:3000
```
## Admin Testing (For Reviewers)

- Register as an admin using the Admin Register page with this secret key (be0d817b9881e421)
- Login as admin
- Access the admin dashboard
- View complaints, update statuses, and verify email notifications

## 📦 Deployment

- Deployed using Vercel
- MongoDB Atlas used for the production database
- SMTP credentials and environment variables configured via the Vercel dashboard
  
## 🧠 Design Decisions

- Clear separation between user and admin roles
- No unnecessary user authentication for complaint submission
- Middleware-based route protection
- Strict TypeScript and ESLint rules enforced
- Clean and minimal UI focused on usability

