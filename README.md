# 🤖 PromptFlow AI — Full Stack Internship Project

A modern, responsive, full-stack AI-powered web application built using **React.js**, **Vite**, **Express.js**, **bcrypt.js**, **multer**, **Recharts**, and **JWT Authentication**. This project was completed as part of a **Full Stack Internship** and demonstrates modern frontend development, REST API integration, CRUD operations, secure authentication, route guarding, global state management, form validation, file uploads, data visualization, and responsive UI/UX design.

The project evolved across nine key milestones:

- **Week 1 – Task 1:** Consume a Public API (Responsive AI Landing Page)
- **Week 1 – Task 2:** Responsive UI From a Design Brief (Hugging Face API Integration)
- **Week 2 – Task 1:** Full CRUD: Frontend Talking to Your Own Backend (AI Model Ratings & Admin Moderation Panel)
- **Week 2 – Task 2:** Authentication Flow (Signup, Login, Password Hashing, & Protected Routes)
- **Week 3 – Task 1:** Global State, Data Fetching Patterns & UI Polish (Context API, Skeleton Loaders, Empty States)
- **Week 3 – Task 2:** Forms, Validation & Real User Feedback (Multi-Field Form, File Uploads, Dual Validation)
- **Week 4 – Task 1:** File & Media Upload Engine (Drag-and-Drop UI, Multer Storage Pipeline)
- **Week 4 – Task 2:** Real-Time Analytics & Data Visualization Dashboard (Recharts, Server-Side Aggregation API)
- **Week 5 – Task 1:** Testing Across the Stack (Admin Security, Feedback Consolidation, Database Management Panel)

---

## 📌 Project Overview

**PromptFlow AI** is a full-stack platform designed to showcase live AI models, collect community ratings, gather detailed user feedback with attachments, provide authenticated user accounts along with administrative moderation capabilities, and give administrators a real-time analytics view of platform activity.

The platform includes:

- Responsive AI landing page with interactive UI sections
- Live AI model explorer powered by the Hugging Face API
- Community review and rating submission system
- Multi-field user feedback form with file upload support
- Password-protected Admin Moderation Console
- Secure User Authentication System (Signup, Login, & Session Management)
- JWT-secured API routes with bcrypt.js password hashing
- Protected user route guards with auto-redirects
- Centralized global state via React Context (no prop-drilling)
- Skeleton loading states and empty-state UI polish
- Drag-and-drop file & media upload engine with progress tracking
- Real-time analytics dashboard with area, pie, and bar chart visualizations
- Real-time server active-session logging in the terminal
- Consolidated, tested admin database management panel with restored access security

---

## 🚀 Week 1 – Task 1: Responsive AI Landing Page

### 🎯 Objective

Build a modern, component-based landing page for an AI product using React.js following mobile-first principles.

### ✨ Features

- Responsive navigation bar with smooth scrolling
- Hero banner with modern call-to-action buttons
- Feature showcase cards highlighting platform capabilities
- Interactive pricing tiers and contact inquiry section
- Reusable components styled with a dark glassmorphism theme

### 🚀 Learning Outcomes

- React component architecture
- Responsive UI development
- Mobile-first design
- Reusable component design
- Modern frontend workflow using Vite

---

## 🤖 Week 1 – Task 2: Hugging Face AI Model Explorer

### 🎯 Objective

Enhance the landing page by fetching live model data from a public API and rendering interactive UI elements dynamically.

### ✨ Features

- Dynamic API integration with Hugging Face (`AiModelsList.jsx`)
- Live search and filtering by model name or tags
- Loading indicators and error-handling states
- Responsive model cards with direct links to Hugging Face repositories

### 🔄 Data Flow

```
User → React Component → Fetch API → Hugging Face API → JSON Response → Dynamic UI Rendering
```

### 🚀 Skills Demonstrated

- REST API Integration
- Fetch API
- React Hooks (useState, useEffect)
- Dynamic rendering & state management
- Error handling

---

## ⭐ Week 2 – Task 1: AI Model Ratings & Admin Moderation Panel

### 🎯 Objective

Transform the site into a CRUD-enabled full-stack platform with public feedback submission and administrative controls.

### 🌟 Public Review Interface (`CrudDashboard.jsx`)

- Submit star ratings (1–5 stars) and feedback
- Scrollable community review feed
- Read-only layout preventing unauthorized editing or deletion

Public users **can**: create reviews, view reviews
Public users **cannot**: edit or delete reviews

### 🔒 Admin Moderation Panel (`AdminPanel.jsx`)

- Password-protected admin gate (`admin123`)
- JWT token stored in localStorage
- Full CRUD access: inspect, modify, or delete any user submission

### 🛡 Backend Security

- Protected Routes: `PUT`, `DELETE`
- Authentication middleware verifies Bearer Token & authorized administrator access
- Unauthorized users cannot modify or remove any review

---

## 🔐 Week 2 – Task 2: Real User Authentication & Protected Routes

### 🎯 Objective

Implement real user account management on the frontend and backend, with secure password handling, persistent sessions, and protected route access.

### ✨ Features

- **Dual-Purpose Auth Form (`AuthModal.jsx`):** Client-side validation rules (required fields, `@` email format, 6+ character password minimum)
- **Password Hashing (bcryptjs):** Encrypts user passwords securely on the Express server before saving
- **Token Storage & Session Persistence:** Issues JWTs on signup/login, saved in localStorage, attached as Bearer tokens in Authorization headers
- **Protected Dashboard Route (`Dashboard.jsx`):** Private workspace route guarded in `App.jsx`. Unauthenticated visitors are automatically redirected to the login interface
- **Logout & Session Termination:** Clears client tokens and notifies the backend to destroy active session references
- **Real-Time Active Session Logs:** Prints live terminal notifications whenever users log in, sign up, or log out

---

## 🧩 Week 3 – Task 1: Global State, Data Fetching Patterns & UI Polish

### 🎯 Objective

Centralize application state, eliminate prop-drilling across multi-level components, and polish asynchronous loading and zero-data UI states.

### ✨ Features & Implementation

- **Global State Architecture (`src/context/AppContext.jsx`):**
  Implemented React's Context API (`AppProvider` & `useApp` hook) to globally manage user authentication session (`user`), current active navigation tab (`activeTab`), admin moderation view toggle (`isAdminView`), and public community reviews (`reviews`).

- **Refactored Features (Prop-Drilling Removed):**
  - `Navbar.jsx`: Directly consumes `user`, `activeTab`, and `handleLogout` from the global store without receiving props from `App.jsx`.
  - `CrudDashboard.jsx`: Pulls `reviews`, `isReviewsLoading`, and `fetchReviews` directly from global context instead of managing localized fetching states.

- **Skeleton Loaders (`src/components/SkeletonLoader.jsx`):**
  Replaced blank screens and static spinners with CSS-animated shimmer placeholders (`<SkeletonCard/>`) while fetching asynchronous data.

- **Empty State UI (`src/components/EmptyState.jsx`):**
  Replaced empty lists and unhandled layout gaps with a clean fallback component (`<EmptyState/>`) when zero database records exist.

### 🚀 Skills Demonstrated

- React Context API & custom hooks
- Eliminating prop-drilling in multi-level component trees
- Asynchronous UI polish (skeleton loading states)
- Zero-data / empty-state UX design

---

## 📝 Week 3 – Task 2: Forms, Validation & Real User Feedback

### 🎯 Objective

Build a multi-field form connected to the backend with strict dual-layer validation (client & server), file upload capabilities, loading states, and toast notifications.

### ✨ Features & Implementation

- **6+ Input Fields (`UserFeedbackForm.jsx`):**
  1. `Full Name` — Text input, minimum 3 characters
  2. `Email Address` — Email input with regex validation
  3. `Category` — Dropdown `<select>` menu
  4. `Experience Date` — Date picker, blocks future dates
  5. `Attachment` — File input accepting `.png`, `.jpg`, `.jpeg`, and `.pdf` up to 5MB
  6. `Comments` — Textarea, minimum 10 characters

- **Dual-Layer Field Validation:**
  - **Client-Side:** Checks inputs instantly on submit and displays field-specific error messages directly under failing inputs.
  - **Server-Side Guard:** The Express server re-validates all payload fields. Never trusts frontend input alone and returns structured HTTP `400` errors if bypassed.

- **Multipart File Storage (`multer`):** Handles image/document uploads via `multer` middleware, storing them in `./uploads` and serving them statically.

- **UI Feedback & Loading States:**
  - Submit button disables during request processing (`isSubmitting`) to prevent double submission.
  - Features an inline spinning loading indicator.
  - Displays success or error toast banners above the form upon completion.

- **Unified Community Hub (`CrudDashboard.jsx`):** Combines the Week 2 Quick Reviews and Week 3 Detailed Form into a tabbed section (`⭐ Public Reviews` vs `📝 Report an Issue & Uploads`).

### 🚀 Skills Demonstrated

- Multi-field form design & React controlled inputs
- Client-side and server-side validation
- File upload handling with `multer`
- Middleware-based request guarding
- Async loading states & toast notification UX

---

## 📁 Week 4 – Task 1: File & Media Upload Engine

### 🎯 Objective

Give users a frictionless way to attach, upload, and process files, replacing basic browser `<input type="file" />` elements with a production-ready drag-and-drop experience backed by a robust storage pipeline.

### ✨ Features & Implementation

- **Client-Side Drag & Drop UI (`src/components/FileUpload.jsx`):**
  An interactive dropzone component with drag-state styling, OS file-picker triggers, and immediate file preview cards displaying file names, formatted sizes, and file type badges.

- **Strict Validation Rules:**
  Client-side and server-side validation checks enforce a 5MB size limit and restrict uploads to supported document and image formats (`.pdf`, `.docx`, `.png`, `.jpg`).

- **Progress Tracking & Feedback:**
  Real-time upload progress bar animation with visual success/error state cards and download/view links.

- **Backend Storage Pipeline (`server/index.js`):**
  Configured Multer disk storage on the Node.js/Express server to auto-create an `./uploads/` directory, apply unique timestamped file identifiers to prevent collisions, and serve files statically via Express static routes (`app.use('/uploads', express.static('uploads'))`).

- **Upload Endpoint:** `POST /api/upload` processes multipart form uploads and returns public file URLs.

### 🏗 Architecture & Tech Stack

- **Frontend:** React, HTML5 Drag & Drop API, Fetch API with progress handlers
- **Backend:** Node.js, Express, Multer (`multer.diskStorage`)

### 🚀 Skills Demonstrated

- Drag-and-drop UI engineering
- Client & server-side file validation
- Upload progress tracking with the Fetch API
- Multer disk storage configuration & static file serving

---

## 📊 Week 4 – Task 2: Real-Time Analytics & Data Visualization Dashboard

### 🎯 Objective

Give administrators and stakeholders a centralized, real-time view of platform activity — signups, feedback submissions, and document uploads — instead of manually checking server logs or database entries.

### ✨ Features & Implementation

- **Server-Side Aggregation API (`GET /api/analytics`):**
  Computes live revenue totals, active user sessions, storage usage in megabytes, and activity distribution across platform features.

- **Key Performance Metric Cards:**
  Four high-level stat cards positioned at the top of the view offer an immediate health check (99.9% uptime, total revenue, user count, processed files).

- **Multi-Format Data Visualizations (`src/components/AnalyticsDashboard.jsx`, powered by Recharts):**
  1. **Area Chart** — Displays monthly growth trends for revenue and user acquisition.
  2. **Donut / Pie Chart** — Visualizes feature utilization breakdown (Document Summaries, Code Analysis, Feedback, Media).
  3. **Bar Chart** — Tracks monthly infrastructure storage load in megabytes.

- **Interactive Control & Responsiveness:**
  A category filter dropdown (All Metrics, Revenue, Active Users, Storage) dynamically re-fetches and filters backend data via `req.query.category`. Charts are wrapped in `ResponsiveContainer` to guarantee fluidity across desktop and mobile screens.

### 🏗 Architecture & Tech Stack

- **Frontend:** React, Recharts (`AreaChart`, `PieChart`, `BarChart`, `ResponsiveContainer`)
- **Backend:** Express REST API, query parameter filtering (`req.query.category`), server-side stat aggregation

### 🚀 Skills Demonstrated

- Server-side data aggregation & REST API design
- Recharts-based data visualization (area, pie, bar charts)
- Query-parameter-driven backend filtering
- Responsive chart layouts

### 💡 How Week 4 Tasks 1 & 2 Work Together

Together, these two tasks form a complete cycle: Task 1 gives users the power to upload files to the server, while Task 2 aggregates those file uploads into real-time storage metrics and usage charts on the analytics dashboard.

### 📌 Week 4 File Change Summary

| File Path | Status | Task | Key Purpose |
| --- | --- | --- | --- |
| `src/components/FileUpload.jsx` | **Created** | Task 1 | Drag-and-drop file upload UI & progress tracking |
| `src/components/AnalyticsDashboard.jsx` | **Created** | Task 2 | Recharts data visualization dashboard component |
| `server/index.js` | **Updated** | Task 1 & 2 | Added Multer file storage routes + `/api/analytics` endpoint |
| `src/App.jsx` | **Updated** | Task 1 & 2 | Imported and mounted both components into the landing page and tab views (`activeTab === 'upload'`, `activeTab === 'analytics'`) |

---

## 🧪 Week 5 – Task 1: Testing Across the Stack

### 🎯 Objective

Consolidate administrative controls, harden access to sensitive data, and optimize full-stack data management, backed by a dedicated frontend and backend test suite.

### ✨ Features & Implementation

- **Restored and Secured Admin Mode:**
  Integrated a password verification modal to block unauthorized access to the admin console, while establishing a robust interface for managing user feedback and contact inquiries.

- **Streamlined Feedback Submissions:**
  Made file attachments optional on the feedback form and resolved data mapping errors between frontend forms and the backend API, ensuring a smooth, consistent submission experience regardless of whether an attachment is included.

- **Enhanced Database Management Panel:**
  Added improved editing, deleting, and data visualization capabilities to the admin panel, keeping feedback and contact records synchronized across both administrative and public views.

- **Cross-Stack Test Suite:**
  Introduced dedicated test directories on both the frontend and backend to validate API behavior, component rendering, and end-to-end user flows.
  - `server/tests/api.test.js` — Backend API endpoint tests (auth, CRUD, feedback, uploads, analytics)
  - `src/__tests__/components.test.jsx` — Component-level rendering and interaction tests
  - `src/__tests__/e2eFlow.test.jsx` — End-to-end flow tests covering multi-step user journeys
  - `src/setupTests.js` — Shared test environment configuration
  - `vite.config.js` — Added/updated to support the test runner alongside the Vite dev server

### 🚀 Skills Demonstrated

- Backend and frontend test suite design
- Admin authentication & access control hardening
- Data mapping consistency between client and server
- Admin panel CRUD & data visualization refinement
- Full-stack QA and regression prevention

### 📌 Week 5 File Change Summary

| File Path | Status | Task | Key Purpose |
| --- | --- | --- | --- |
| `server/tests/api.test.js` | **Created** | Task 1 | Backend API test coverage |
| `src/__tests__/components.test.jsx` | **Created** | Task 1 | Component rendering/interaction tests |
| `src/__tests__/e2eFlow.test.jsx` | **Created** | Task 1 | End-to-end user flow tests |
| `src/setupTests.js` | **Created** | Task 1 | Test environment setup |
| `vite.config.js` | **Created/Updated** | Task 1 | Test runner configuration |
| `AdminPanel.jsx` | **Updated** | Task 1 | Restored password verification modal, improved CRUD & data visualization |
| `UserFeedbackForm.jsx` | **Updated** | Task 1 | Optional file attachments, corrected field mapping to backend API |
| `server/index.js` | **Updated** | Task 1 | Fixed feedback/contact data mapping to keep records synchronized |

---

## 📂 Complete Project Structure

```
AI-LANDING-PAGE/
│
├── .vscode/
├── node_modules/
│
├── server/
│   ├── tests/
│   │   └── api.test.js       # Backend API test suite (Week 5)
│   └── index.js               # Express backend: JWT auth, bcrypt, multer file storage,
│                               # /api/upload, /api/analytics aggregation, dual-validation guards,
│                               # terminal logging, and synced feedback/contact data mapping
│
├── src/
│   ├── __tests__/
│   │   ├── components.test.jsx # Component rendering/interaction tests (Week 5, NEW)
│   │   └── e2eFlow.test.jsx    # End-to-end user flow tests (Week 5, NEW)
│   ├── components/
│   │   ├── AnalyticsDashboard.jsx # Recharts analytics dashboard (area/pie/bar charts)
│   │   ├── EmptyState.jsx    # Reusable fallback card for zero-data states
│   │   ├── FileUpload.jsx    # Drag-and-drop upload UI with progress tracking
│   │   └── SkeletonLoader.jsx # Animated shimmer cards for async loading
│   ├── context/
│   │   └── AppContext.jsx    # Global React Context provider & useApp hook
│   ├── AdminPanel.jsx        # Protected admin moderation panel (password modal, enhanced CRUD) (UPDATED)
│   ├── AiModelsList.jsx      # Live model explorer using Hugging Face API
│   ├── App.jsx               # Root layout wrapped in <AppProvider>, view router, and route guard logic
│   ├── AuthModal.jsx         # Client-validated Signup & Login modal form
│   ├── Contact.jsx           # Contact section
│   ├── CrudDashboard.jsx     # Unified Community Hub & Support Center with tabs, using global store
│   ├── Dashboard.jsx         # Protected user workspace route
│   ├── Features.jsx          # AI product features showcase
│   ├── Footer.jsx            # Platform footer
│   ├── Hero.jsx              # Hero section banner
│   ├── index.css             # Global dark-theme styles & glassmorphism
│   ├── main.jsx               # React entry point
│   ├── Navbar.jsx             # Navigation bar using direct global state
│   ├── Pricing.jsx            # Subscription pricing tiers
│   ├── setupTests.js          # Shared test environment configuration (Week 5, NEW)
│   └── UserFeedbackForm.jsx   # Multi-field feedback form with optional file upload & validation (UPDATED)
│
├── uploads/                    # Static file storage directory (feedback attachments + Task 1 uploads)
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies (express, cors, jsonwebtoken, bcryptjs, multer, recharts, vite, react)
├── package-lock.json          # Automatically generated dependency lock file
├── vite.config.js             # Vite build & test runner configuration (Week 5, NEW)
└── README.md                  # Project documentation
```

---

## 🔑 Credentials & Access Levels

| Role | Access Method / Password | Permissions |
|------|---------------------------|-------------|
| **Public Visitor** | None | Submit ratings & feedback, read community feedback |
| **Registered User** | Created via Signup | Access protected `/dashboard` & session persistence |
| **Administrator** | Password: `admin123` (verified via password modal) | Full CRUD access (Create, Read, Update, Delete) |

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Access Level | Description |
|--------|----------|---------------|--------------|
| GET | `/api/contacts` | Public | Retrieve all community ratings & messages |
| POST | `/api/contacts` | Public | Submit new feedback record |
| POST | `/api/feedback` | Public | Submit multi-field feedback form with optional file attachment (multer, dual validation) |
| POST | `/api/auth/signup` | Public | Register new user account with hashed password |
| POST | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| POST | `/api/auth/logout` | User | Clear session from active tracking |
| GET | `/api/auth/me` | Protected | Verify user JWT token and fetch profile |
| POST | `/api/admin/login` | Admin | Authenticate admin password (`admin123`) via password modal |
| PUT | `/api/contacts/:id` | **Admin Only** | Update existing record (Requires JWT) |
| DELETE | `/api/contacts/:id` | **Admin Only** | Remove review from database (Requires JWT) |
| GET | `/api/admin/active-users` | Admin | View active sessions and real-time logs |
| POST | `/api/upload` | Public | Upload a file via multipart form data; returns a public file URL |
| GET | `/api/analytics` | Admin | Retrieve aggregated platform metrics (revenue, users, storage, feature usage); supports `?category=` filtering |

---

## 🎨 Design System

**Layout:** CSS Flexbox, CSS Grid, Responsive Breakpoints, Mobile-first Design
**Typography:** Clear hierarchy, consistent spacing, readable text
**UI Style:** Modern AI-inspired interface, dark theme, glassmorphism effects, interactive cards, smooth layouts, shimmer loading states, clean empty-state placeholders, drag-and-drop dropzones, responsive data visualizations

---

## 🛠 Technologies Used

**Frontend:** React.js, Vite, JavaScript (ES6+), HTML5, CSS3, React Context API, HTML5 Drag & Drop API, Recharts
**Backend:** Express.js, Node.js, JSON Web Token (JWT), bcrypt.js, multer, CORS
**API:** Hugging Face Models API, Fetch API
**Testing:** Frontend and backend test suites for API, component, and end-to-end coverage

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/UBAID0704/PromptFlow-AI-Landing-Page-.git
cd ai-landing-page
```

### 2. Install Dependencies

```bash
# Install frontend & backend dependencies
npm install
npm install express cors jsonwebtoken bcryptjs multer recharts
```

---

## ▶ Running the Application

To run the full-stack system, open **two separate terminal windows** in VS Code:

### Terminal 1: Express Backend API

```bash
node server/index.js
```

> **Output:** 🚀 Server running at http://localhost:5000

### Terminal 2: React Frontend App

```bash
npm run dev
```

> **Output:** VITE ready → Local: http://localhost:5173/

---

## 🖥️ Real-Time Terminal Activity Logs

While `node server/index.js` is running in Terminal 1, all authentication and management actions print live activity blocks directly to the console:

```
========================================
🔑 [USER LOGGED IN]
👤 User: Ubaidullah (ubaid@example.com)
⏰ Time: 8:45:12 PM
📊 Total Active Sessions: 1
========================================

📝 [RECORD UPDATED] ID #1 by Admin Console
🚪 [USER LOGGED OUT] User: Ubaidullah (ubaid@example.com)
📎 [FEEDBACK SUBMITTED] Attachment uploaded: report-screenshot.png
```

---

## 🧪 Testing Instructions (Week 3, Week 4 & Week 5)

### Prerequisites

Make sure both the backend and frontend are running simultaneously:

```bash
# Terminal 1: Backend Server
cd server
node index.js

# Terminal 2: Frontend Client
npm run dev
```

### Step-by-Step Feature Verification

**1. Testing Global Context — No Prop-Drilling (Task 1)**
- Open http://localhost:5173 in your browser.
- Click Log In / Sign Up in the Navbar and sign in.
- Observe how the Navbar instantly displays the 👤 Dashboard and Logout options across all components without needing top-level prop re-renders.

**2. Testing Skeleton Loaders (Task 1)**
- Open Chrome DevTools (F12) → Network tab.
- Set network throttling to Slow 3G.
- Reload the page or switch tabs.
- Verify that animated shimmer cards (`<SkeletonCard/>`) appear inside the Public Feed and Admin Panel while `GET /api/contacts` is loading.

**3. Testing Empty States (Task 1)**
- Clear all items from your database/contacts endpoint.
- Navigate to the Community Feed or Admin Panel.
- Verify that the 📂 Database Empty / 📭 No Reviews Found card appears rather than a blank space.

**4. Testing Multi-Field Form Validation & Uploads (Task 2)**
- Go to the Report an Issue & Uploads tab inside the dashboard.
- Attempt submitting an empty form to observe field-specific error messages.
- Complete all fields (including selecting a category and date) and submit both with and without an attachment to confirm attachments are now optional.
- Verify the loading state on the submission button and the resulting feedback toast banner.

**5. Testing the Drag-and-Drop File Upload Engine (Week 4, Task 1)**
- Navigate to the Upload view (`activeTab === 'upload'`).
- Drag a supported file (`.pdf`, `.docx`, `.png`, `.jpg`) under 5MB onto the dropzone and confirm the drag-state styling activates.
- Confirm a file preview card appears showing name, formatted size, and type badge, and that the upload progress bar animates to completion.
- Try uploading an unsupported file type or one over 5MB and confirm the client-side error state is shown before it hits the server.

**6. Testing the Analytics Dashboard (Week 4, Task 2)**
- Navigate to the Analytics view (`activeTab === 'analytics'`).
- Confirm the four metric stat cards (uptime, revenue, users, processed files) render with live values from `GET /api/analytics`.
- Confirm the area, pie/donut, and bar charts render correctly and resize responsively when the browser window is resized or viewed on mobile.
- Use the category filter dropdown (All Metrics, Revenue, Active Users, Storage) and confirm the charts re-fetch and update based on the selected `?category=` query parameter.

**7. Testing Admin Access Security & Data Sync (Week 5, Task 1)**
- Attempt to open the Admin Panel without entering the password and confirm access is blocked by the verification modal.
- Enter the correct admin password (`admin123`) and confirm the panel unlocks with full CRUD access.
- Submit a feedback record with no attachment and confirm it maps correctly into both the admin panel and public views without errors.
- Edit and delete a record from the enhanced Database Management Panel and confirm it stays synchronized across admin and public views.

**8. Running the Automated Test Suite (Week 5, Task 1)**
- Run backend API tests: `npm test --prefix server` (or the configured test script for `server/tests/api.test.js`).
- Run frontend component and end-to-end tests: `npm test` (executes `src/__tests__/components.test.jsx` and `src/__tests__/e2eFlow.test.jsx` via the Vite-configured test runner).
- Confirm all suites pass before merging changes.

---

## 🎓 Learning Outcomes

**Frontend Development:** React.js, Component-Based Architecture, Responsive Web Design, Reusable UI Components, Modern CSS Layouts

**API Integration:** REST APIs, Fetch API, Dynamic Rendering, Search & Filtering, Loading & Error States

**Full Stack Development:** Express.js Backend, CRUD Operations, JWT Authentication, Protected Routes, Role-Based Access, RESTful API Design

**Forms & Validation:** Multi-Field Form Design, Client & Server-Side Validation, File Uploads with Multer, Loading States & Toast Notifications

**State Management & UI Polish:** React Context API, Eliminating Prop-Drilling, Skeleton Loading States, Empty-State UX Design

**File Handling & Media:** Drag-and-Drop UI Engineering, HTML5 Drag & Drop API, Multer Disk Storage, Upload Progress Tracking, Client & Server File Validation

**Data Visualization & Analytics:** Recharts (Area, Pie, Bar Charts), Server-Side Data Aggregation, Query-Parameter-Driven Filtering, Responsive Chart Design

**Testing & QA:** Backend API Testing, Component & Interaction Testing, End-to-End Flow Testing, Test Environment Configuration

**Software Engineering:** Project Structure, State Management, Authentication Flow, Error Handling, Clean Code Organization

---

## 🔮 Future Improvements

- AI-powered content generation
- AI writing playground
- Database-backed user authentication
- Cloud database integration
- AI chatbot assistant
- Advanced AI model filtering
- User profiles
- Review moderation history
- Image generation support
- Bookmark favorite AI models
- Exportable analytics reports (CSV/PDF)
- Cloud object storage for uploaded files (e.g., S3) instead of local disk storage
- Expanded test coverage (visual regression, load testing)

---

## 👨‍💻 Author

**Ubaidullah**
Computer Science Student — FAST NUCES
**GitHub:** [github.com/UBAID0704](https://github.com/UBAID0704)

---

## 📄 License

This project was developed for educational purposes and as part of a Full Stack Internship assessment.

