
#  `LEARNING.md` 

```md
# Development & Learning Notes – vidCALL

## Landing Page Phase

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
