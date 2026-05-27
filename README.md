# BlogApp Frontend (React + Vite)

Comprehensive documentation for the BlogApp frontend. This project is a modern blogging platform built with React, providing a clean and intuitive interface for readers, authors, and administrators to manage and consume blog content.

**Contents**
- **Description** — What the application does and architecture overview.
- **Features** — High-level feature list.
- **Tech Stack** — Technologies and dependencies used.
- **Getting Started** — Quick start, environment setup, and installation.
- **Process Flow** — How the application works end-to-end.
- **API Endpoints** — All API endpoints consumed by the frontend.
- **Components** — Detailed breakdown of each component and its purpose.
- **State Management** — How data is managed across the application.
- **Routing** — Application routes and navigation flow.
- **Styling** — CSS framework and approach.

---

## Description

BlogApp Frontend is a React-based single-page application (SPA) that serves as the user interface for the BlogApp blogging platform. It enables users with different roles (`USER`, `AUTHOR`, `ADMIN`) to interact with blog content through a modern, responsive interface.

The application follows a role-based access control pattern where:
- **Users** can browse articles, add them to reading lists, and comment.
- **Authors** can create, edit, publish, and manage their articles.
- **Admins** can manage users and moderate content across the platform.

Authentication is handled securely with JWT tokens stored in HTTP-only cookies, managed through a Zustand store.

---

## Features

- **User Authentication** — Secure login/registration with role assignment.
- **Role-Based Access Control** — Different views and actions based on user role (USER, AUTHOR, ADMIN).
- **Article Management** — Create, read, edit, and delete articles (soft delete for authors).
- **Comments System** — Users can comment on articles; comments are nested and tied to user profiles.
- **Responsive Design** — Mobile-first approach using Tailwind CSS for all screen sizes.
- **Real-Time Notifications** — Toast notifications for user feedback (success, errors, warnings).
- **Profile Management** — Users can upload profile pictures during registration.
- **Protected Routes** — Client-side route protection based on authentication status and role.
- **Clean UI** — Minimalist, article-focused design with generous whitespace and readable typography.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19.2** | UI framework and component library |
| **Vite 7.3** | Fast build tool and dev server |
| **React Router 7.13** | Client-side routing |
| **Axios 1.13** | HTTP client for API requests |
| **Zustand 5.0** | Lightweight state management |
| **React Hook Form 7.71** | Efficient form state management |
| **React Hot Toast 2.6** | Toast notifications |
| **Tailwind CSS 4.2** | Utility-first CSS framework |
| **ESLint 9.39** | Code quality and linting |

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Running BlogApp backend server (see backend README)
- MongoDB and Cloudinary configured (backend setup)

### Installation

1. **Navigate to the frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** (optional)

If your backend is running on a different port/URL, create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

By default, the frontend connects to `https://blogapp-backend-rmdp.onrender.com`. For local development, set `VITE_API_URL=http://localhost:4000`.

4. **Start the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

5. **Build for production**

```bash
npm run build
```

---

## Process Flow

### User Journey

#### 1. **Landing Page (Home)**
- User lands on the homepage (`/`)
- Sees the platform's value proposition with call-to-action buttons
- Options to "Start writing" (register as author) or "Browse as reader" (login)

#### 2. **Registration**
- User selects role: `USER` (reader) or `AUTHOR` (writer)
- Fills in registration form: first name, last name, email, password, profile image
- Profile image is uploaded via multipart/form-data during registration
- Upon success, user is redirected to login page

#### 3. **Authentication**
- User logs in with email and password
- Backend validates credentials and returns JWT token
- Token is stored in HTTP-only cookie (managed by browser)
- User's role and profile data are cached in Zustand store
- User is redirected to their role-specific dashboard

#### 4. **Role-Based Experience**

**USER (Reader):**
- Lands on **Home** page showing published articles
- Clicks article to view full content and comments
- Can add articles to reading list (**User Dashboard**)
- Can comment on articles
- Can change password

**AUTHOR (Writer):**
- Lands on **Author Dashboard** showing their published and drafted articles
- Can create new article via **New Post** button
- Fills article form: title, category, content
- Article is published immediately to the platform
- Can edit or soft-delete their articles
- Can restore deleted articles
- Can view article stats and reader comments

**ADMIN (Moderator):**
- Lands on **Admin Dashboard**
- Can view all articles (including inactive/soft-deleted ones)
- Can block/unblock users
- Can moderate content

#### 5. **Article Viewing**
- Click on any article from home or dashboard
- View full article content with author info
- See all comments from other users
- Add your own comment (if logged in as USER)

#### 6. **Logout**
- User clicks "Log out" button in header
- Token cookie is cleared
- User is redirected to login page

---

## API Endpoints

The frontend consumes the following backend API endpoints. All requests include credentials (cookies) for authentication.

### **Base URL**
```
${API_BASE} = http://localhost:4000 (or VITE_API_URL from .env)
```

### **Common Endpoints**

| Method | Endpoint | Purpose | Auth | Response |
|--------|----------|---------|------|----------|
| POST | `/common-api/login` | Authenticate user | No | `{ message, payload: user }` |
| GET | `/common-api/check-auth` | Verify current session | JWT | `{ message, payload: user }` |
| GET | `/common-api/articles/:articleId` | Fetch single article with comments | JWT | `{ message, payload: article }` |
| POST | `/common-api/logout` | Clear authentication | JWT | `{ message }` |
| PUT | `/common-api/change-password` | Update user password | JWT | `{ message, payload }` |

### **User Endpoints** (`/user-api`)

| Method | Endpoint | Purpose | Auth | Notes |
|--------|----------|---------|------|-------|
| POST | `/user-api/users` | Register as USER | No | Multipart form-data with profile image |
| GET | `/user-api/articles` | Fetch all published articles | JWT | Role restricted to USER |
| PUT | `/user-api/articles` | Add comment to article | JWT | Body: `{ articleId, user, comment }` |

### **Author Endpoints** (`/author-api`)

| Method | Endpoint | Purpose | Auth | Notes |
|--------|----------|---------|------|-------|
| POST | `/author-api/users` | Register as AUTHOR | No | Multipart form-data with profile image |
| POST | `/author-api/articles` | Create new article | JWT | Body: `{ title, category, content, author }` |
| GET | `/author-api/articles/:authorId` | Fetch author's articles | JWT | Returns active articles only |
| PUT | `/author-api/articles` | Edit article | JWT | Author ownership validated on backend |
| DELETE | `/author-api/articles/authorId/:authorId/articleId/:articleId` | Soft-delete article | JWT | Sets `isArticleActive: false` |
| PATCH | `/author-api/articles/authorId/:authorId/articleId/:articleId` | Restore article | JWT | Sets `isArticleActive: true` |

### **Admin Endpoints** (`/admin-api`)

| Method | Endpoint | Purpose | Auth | Notes |
|--------|----------|---------|------|-------|
| GET | `/admin-api/articles` | Fetch all articles (including inactive) | JWT + Admin | Admin-only access |
| PUT | `/admin-api/block-user` | Block a user | JWT + Admin | Body: `{ userId, adminId }` |
| PUT | `/admin-api/unblock-user` | Unblock a user | JWT + Admin | Body: `{ userId, adminId }` |

---

## Components

### **1. RootLayout**
**Purpose:** Main wrapper component that provides the overall structure for the application.

**Responsibilities:**
- Renders the `<Header />` component for navigation
- Provides an `<Outlet />` for nested route rendering
- Checks authentication on app load via `useAuth().checkAuth()`
- Displays connection error messages if the backend is unreachable

**Key Props:** None (uses Zustand store)

---

### **2. Header**
**Purpose:** Navigation bar displayed at the top of every page.

**Responsibilities:**
- Displays the BlogApp logo and branding
- Shows navigation links based on user authentication status and role
- Displays current user's name when logged in
- Provides role-specific links:
  - **USER:** "Reading list" link to `/user-dashboard`
  - **AUTHOR:** "Studio" link to `/author-dashboard` and "New post" link to `/add-article`
  - **ADMIN:** "Admin" link to `/admin-dashboard`
- Provides "Sign in" and "Join" buttons for unauthenticated users
- Logout button that clears token and redirects to login

**State:** Uses `useAuth()` from Zustand store to access `isAuthenticated`, `currentUser`, `logout`

**Styling:** Tailwind CSS with fixed positioning, glassmorphism effect (backdrop blur)

---

### **3. Home**
**Purpose:** Landing page for both authenticated and unauthenticated users.

**Responsibilities:**
- Displays hero section with platform value proposition
- Shows three feature cards:
  - "Calm reading" — highlights article readability
  - "Author studio" — promotes article creation
  - "Threaded voices" — emphasizes community engagement
- Provides call-to-action buttons:
  - "Start writing" → Register page
  - "Browse as reader" → Login page

**State:** None (purely presentational)

**Styling:** Hero with radial gradient background, feature cards with subtle borders and blur effects

---

### **4. Register**
**Purpose:** User registration form for creating new USER or AUTHOR accounts.

**Responsibilities:**
- Form fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, unique validation)
  - Password (required)
  - Role selector (USER or AUTHOR)
  - Profile Image upload (JPEG/PNG only, max 2MB)
- Validates form inputs before submission
- Displays image preview when user selects a file
- Sends multipart/form-data request to backend (`/user-api/users` or `/author-api/users`)
- Handles errors and displays error messages
- Redirects to login on successful registration

**State:** Uses `react-hook-form` for form state, local state for loading, error, and image preview

**Validation:**
- Email format and uniqueness (backend validation)
- Password strength (backend validation)
- Image type (JPEG/PNG only)
- Image size (max 2MB)

**Styling:** Card-based form layout, responsive grid, Tailwind utility classes

---

### **5. Login**
**Purpose:** Authentication form for existing users.

**Responsibilities:**
- Form fields:
  - Email (required)
  - Password (required)
- Validates credentials against backend
- Sets authentication cookie on successful login
- Stores user data and role in Zustand store
- Redirects to role-specific dashboard:
  - USER → `/user-dashboard`
  - AUTHOR → `/author-dashboard`
  - ADMIN → `/admin-dashboard`
- Handles authentication errors gracefully

**State:** Uses `react-hook-form` for form state, Zustand `useAuth()` for authentication

**Styling:** Similar to Register component, centered form layout

---

### **6. ProtectedRoute**
**Purpose:** Route protection wrapper that enforces authentication and role-based access.

**Responsibilities:**
- Checks if user is authenticated
- Verifies user's role matches allowed roles
- Redirects unauthenticated users to `/login`
- Redirects users without permission to `/unauthorized`
- Shows loading indicator while checking authentication
- Wraps dashboard and role-specific routes

**Props:**
- `children` — React component to render if authorized
- `allowedRoles` — Array of roles allowed to access route (e.g., `['AUTHOR']`)

**State:** Uses `useAuth()` from Zustand to check `isAuthenticated`, `currentUser.role`, `loading`

**Example Usage:**
```jsx
<ProtectedRoute allowedRoles={['AUTHOR']}>
  <AuthorDashboard />
</ProtectedRoute>
```

---

### **7. AddArticle**
**Purpose:** Form for creating and publishing new articles (AUTHOR only).

**Responsibilities:**
- Form fields:
  - Title (required, minimum 5 characters)
  - Category (select dropdown)
  - Content (required, rich text or textarea)
  - Featured Image (optional)
- Validates form inputs
- Sends POST request to `/author-api/articles`
- Displays success toast notification on publish
- Redirects to `/author-dashboard` after successful publish
- Handles errors and displays error messages

**State:** Uses `react-hook-form` for form state, `useNavigate()` for routing, `useAuth()` for current user

**API Integration:** POST to `${API_BASE}/author-api/articles`

**Styling:** Similar form layout, larger content textarea for writing

---

### **8. UserDashboard**
**Purpose:** Reading list and article browsing interface for USER role.

**Responsibilities:**
- Displays all published articles
- Shows article cards with:
  - Title
  - Author info (name, profile image)
  - Category
  - Preview/excerpt
  - Publish date
- Click article to view full content
- Add/remove articles from reading list (if feature implemented)
- Filter articles by category (if feature implemented)

**State:** Fetches articles from `/user-api/articles` endpoint, uses Zustand for user context

**Protected:** Only accessible to users with `USER` role

---

### **9. AuthorDashboard**
**Purpose:** Studio interface for managing author's articles.

**Responsibilities:**
- Displays author's published articles
- Displays author's draft articles (if implemented)
- For each article shows:
  - Title
  - Category
  - Publication status (Published/Draft)
  - Comment count
  - Created/updated date
- Actions for each article:
  - View
  - Edit
  - Delete (soft-delete)
  - Restore (if soft-deleted)
- "New Post" button to create article
- Statistics (total articles, total views, etc. if implemented)

**State:** Fetches articles from `/author-api/articles/:authorId` endpoint, manages article list in component state

**Protected:** Only accessible to users with `AUTHOR` role

---

### **10. AdminDashboard**
**Purpose:** Moderation and administration interface for ADMIN role.

**Responsibilities:**
- Displays all articles (including inactive/soft-deleted)
- Shows user management panel:
  - List of all users
  - User status (active/blocked)
- Actions:
  - Block user
  - Unblock user
  - View user details
  - Moderate articles (if implemented)
- Analytics overview (if implemented)

**State:** Fetches data from `/admin-api/` endpoints, uses Zustand for admin context

**Protected:** Only accessible to users with `ADMIN` role

---

### **11. ArticleById**
**Purpose:** Detailed article view with comments section.

**Responsibilities:**
- Fetches article by ID from URL params
- Displays:
  - Full article title
  - Author information (name, profile image)
  - Publication date
  - Category/tags
  - Full article content
  - Comments section with user profiles
- Users can add comments (if logged in as USER)
- Shows comment count and list of all comments
- Displays author's other articles (if implemented)

**State:** Fetches article from `/common-api/articles/:articleId`, manages comment input state

**Parameters:** `:id` — Article ID from URL

**API Integration:** GET to `${API_BASE}/common-api/articles/:articleId`

---

### **12. Unauthorized**
**Purpose:** Error page shown when user lacks permissions to access a route.

**Responsibilities:**
- Displays user-friendly error message
- Explains that user doesn't have permission to access the page
- Provides navigation options:
  - Return to home
  - Return to previous page
  - Login as different user

**State:** None (purely presentational)

**Styling:** Large error message, prominent buttons

---

## State Management

### **Zustand Store: `useAuth`**

The application uses **Zustand** for global state management, specifically for authentication and user context.

**Store Structure:**

```javascript
const useAuth = create((set) => ({
  // State
  currentUser: null,              // Logged-in user object
  loading: false,                 // Loading indicator
  isAuthenticated: false,         // Auth status
  error: null,                    // Error message
  connectionError: null,          // Backend connection error

  // Actions
  checkAuth: async () => { ... }, // Verify current session
  login: async (email, password) => { ... },
  logout: () => { ... },
  register: async (userData) => { ... }
}))
```

**Usage in Components:**

```javascript
const { isAuthenticated, currentUser, logout, checkAuth } = useAuth()
```

**Key Methods:**

| Method | Purpose | Triggered |
|--------|---------|-----------|
| `checkAuth()` | Calls `/common-api/check-auth` to verify session on app load | App initialization (RootLayout) |
| `login()` | Calls `/common-api/login` and stores user data | User submits login form |
| `logout()` | Calls `/common-api/logout`, clears token cookie, resets state | User clicks logout button |

---

## Routing

The application uses **React Router v7** for client-side navigation.

### **Route Structure**

```
/ (RootLayout)
├── / (Home) — Landing page
├── /register (Register) — User registration
├── /login (Login) — User login
├── /add-article (AddArticle) — Create article [AUTHOR only]
├── /user-dashboard (UserDashboard) — User's reading list [USER only]
├── /author-dashboard (AuthorDashboard) — Author's studio [AUTHOR only]
├── /admin-dashboard (AdminDashboard) — Admin panel [ADMIN only]
├── /article/:id (ArticleById) — View single article
├── /unauthorized (Unauthorized) — Access denied page
└── * (404) — Page not found
```

### **Protected Routes**

Routes with role restrictions are wrapped in `<ProtectedRoute>` component:

```jsx
<ProtectedRoute allowedRoles={['AUTHOR']}>
  <AddArticle />
</ProtectedRoute>
```

### **Route Transitions**

**Authentication Flow:**
1. User not logged in → `/login` or `/register`
2. Login successful → Role-specific dashboard
3. Click logout → `/login`

**Authorization Flow:**
1. USER tries to access `/author-dashboard` → Redirected to `/unauthorized`
2. AUTHOR clicks "New post" → `/add-article` (protected)
3. Invalid article ID → Article fetch fails, error displayed

---

## Styling

### **Framework: Tailwind CSS v4.2**

The entire application is styled with **Tailwind CSS**, a utility-first CSS framework.

### **Design System**

**Color Palette:**
- **Primary:** Stone/Gray (`stone-*`) — Main UI elements
- **Accent:** Amber (`amber-*`) — Call-to-action buttons, highlights
- **Error:** Red (`red-*`) — Error messages, delete actions
- **Success:** Green (via toast library) — Success notifications

**Typography:**
- **Headings:** `font-display` class with font-weight 600-700
- **Body:** Regular font with `leading-relaxed` for readability
- **Small:** `text-xs`, `text-sm` for secondary information

**Spacing:**
- Uses Tailwind's `px-*`, `py-*`, `mt-*`, `gap-*` utilities
- Responsive padding with `sm:`, `lg:` breakpoints

### **Common Style Classes** (`src/styles/common.js`)

```javascript
export const pageWrapper = "..."     // Main page container
export const formCard = "..."        // Card wrapper for forms
export const formTitle = "..."       // Form heading
export const inputClass = "..."      // Input field styling
export const submitBtn = "..."       // Submit button styling
export const errorClass = "..."      // Error message styling
export const loadingClass = "..."    // Loading state text
```

**Responsive Design:**
- Mobile-first approach (styles for mobile, then `sm:`, `md:`, `lg:` overrides)
- Flexible layouts using `flex`, `grid`, and responsive utilities
- Touch-friendly button sizes on mobile
- Readable font sizes on all screen sizes

**Special Effects:**
- Backdrop blur (`backdrop-blur-sm`)
- Shadows (`shadow-sm`, `shadow-lg`)
- Gradients (`radial-gradient`, `linear-gradient`)
- Smooth transitions (`transition`) with hover states

---

## Running the Application

### **Development Mode**

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:5173` with hot module replacement.

### **Production Build**

```bash
npm run build
```

Generates optimized build in `dist/` folder, ready for deployment.

### **Preview Production Build**

```bash
npm run preview
```

Serves the production build locally for testing.

### **Linting**

```bash
npm run lint
```

Checks code quality with ESLint.

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL (no trailing slash)
VITE_API_URL=http://localhost:4000
```

**Default:** If not set, frontend connects to `https://blogapp-backend-rmdp.onrender.com`

---

## Troubleshooting

### **"Cannot reach the server" Error**
- Ensure backend server is running (`npm run dev` in `/backend`)
- Check that MongoDB is running
- Verify `VITE_API_URL` matches your backend URL

### **Login Not Working**
- Clear browser cookies and try again
- Check browser console for network errors
- Verify backend credentials in `.env`

### **Images Not Uploading During Registration**
- Ensure file is JPEG or PNG
- Check file size (max 2MB)
- Verify Cloudinary credentials on backend

### **Protected Routes Not Working**
- Clear authentication state: Log out and log back in
- Check user role assignment in backend database
- Verify token is being stored in cookies (browser DevTools → Application → Cookies)

---

## Deployment

### **Frontend Deployment (Vercel/Netlify)**

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variable: `VITE_API_URL=<backend-url>`
4. Deploy

### **Backend Deployment (Render/Heroku)**

Refer to backend README for deployment instructions.

---

## Future Enhancements

- [ ] Search functionality for articles
- [ ] Article categories/tags filtering
- [ ] Reading time estimate for articles
- [ ] Bookmarking/favoriting articles
- [ ] User profiles with follower system
- [ ] Rich text editor for article creation
- [ ] Article recommendations algorithm
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Article analytics for authors

---

## Support & Contributing

For issues, questions, or contributions, please refer to the main project repository or contact the development team.
