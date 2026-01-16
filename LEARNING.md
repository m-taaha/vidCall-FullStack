
#  `LEARNING.md` 

```md
# Development & Learning Notes – vidCALL

## PHASE 1: Landing Page Phase

### What I Built
- Landing page with dark theme UI
- Glassmorphism-style video placeholder
- Navbar with CTA actions

---

### Tailwind Concepts Learned
- Opacity utilities like `bg-white/10`, `border-white/20`
- Backdrop blur using `backdrop-blur-md`
- Custom height utilities like `h-[400px]`
- Rounded large containers using `rounded-2xl`
- Shadow and glow effects for CTAs

---

### Glassmorphism Notes
Glassmorphism effect was achieved using:
- Semi-transparent background
- Backdrop blur
- Soft borders

This is currently used as a placeholder for the future video preview section of the app.

---

### Routing Learnings
- `Link` components must always be used inside `BrowserRouter`
- Navigation-only actions should use `Link`
- Logic-based navigation should use `useNavigate`
- Router context is required even if routes are not fully implemented

---

### Problems Faced
- `<Link>` throwing error due to missing `BrowserRouter`
- Confusion between button vs Link for navigation
- Understanding why Router context is mandatory

---

### Decisions Made
- "Get Started" redirects to `/register`
- "Join as Guest" allows joining via username + link
- Routes are defined early to avoid refactoring later

---

### Improvements Planned
- Extract layout routes
- Add active navbar states
- Make glassmorphism component reusable
- Improve mobile responsiveness

---

### Reflection
This phase helped me better understand:
- SPA navigation concepts
- Tailwind utility-first styling
- How UI decisions connect with routing logic


---


## PHASE 2: Authenticaton UI & State Management

### What I Built
- Login and Register UI
- Toggle-based auth flow (Login ↔ Register)
- Controlled form inputs
- Form state management using `useState`
- Global authentication state using Context API

---

### Key React Concepts Learned
- Controlled vs uncontrolled inputs
- Functional state updates using `prev`
- Dynamic form state updates using input `id`
- Proper usage of `useContext` with custom hooks
- Separation of UI logic and auth logic

---

### Auth Context Learnings
- Centralized auth logic using Context API
- Async handling with `try / catch / finally`
- Loading state management
- Returning success/error responses instead of handling UI inside context
- Importance of consistent payload shapes between frontend and backend

---

### Backend Integration Learnings
- Payload structure must exactly match backend validators
- Zod schema validation flow
- Password hashing using Mongoose pre-save hooks
- JWT generation and storage using HTTP-only cookies
- Importance of `withCredentials: true` in Axios

---

### Common Mistakes & Fixes
- Using outdated `name` field instead of `firstName` / `lastName`
- Forgetting to send cookies with Axios
- Mismatch between frontend form fields and backend expectations
- Returning incomplete user objects from backend

---

## Decisions Made
- Split `name` into `firstName` and `lastName`
- Keep auth logic inside Context, not UI components
- Use cookies instead of localStorage for JWT
- Build routes early to avoid refactors later

---

## Improvements Planned
- Persist user session on refresh
- Add `/me` endpoint
- Protect routes based on auth state
- Add logout functionality
- Extract reusable form components
- Improve accessibility and mobile UX

---

## Reflection
This phase significantly improved my understanding of:
- Real-world authentication flows
- Frontend–backend contract consistency
- State management at application level
- Writing scalable, maintainable React code

This project helped bridge the gap between **tutorial code** and **production-grade architecture**.
