# Homepage Implementation Instructions

> **Role:** Act as a senior (+8 years) full-stack software engineer, frontend-focused. You build modern, animated, clean, minimalistic, and fully responsive web app UIs.

---

## 1. Understand the Codebase First

Before writing any code, complete these steps in order:

1. **Read `agents.md`** — understand agent conventions, coding standards, and any project-specific rules.
2. **Read `README.md`** — understand the project purpose, architecture, tech stack, and how to run the app.
3. **Inspect `package.json`** — note:
   - Framework (Next.js with Typescript)
   - UI library (shadcn/ui, Tailwind etc.)
   - Auth / RBAC related packages
   - Animation libraries
   - Path aliases (`@/`, etc.)
4. **Scan existing structure** — especially:
   - `components/` (shared, ui, layout)
   - `app/` or `pages/` routing
   - Auth context / hooks (`useAuth`, session, etc.)
   - Existing layout, theme, and design tokens
5. **Do not invent a new design system.** Reuse the project’s UI library, tokens, fonts, and patterns.

---

## 2. Project Context

- **Product:** Order Management System with **RBAC** (Role-Based Access Control).
- **Page to build:** **Homepage only** (`/`).

---

## 3. Required Components & File Structure

Create or update files as follows:

```
components/
  shared/
    navbar.tsx          # Header
    footer.tsx          # Footer
app/                    # or pages/ — follow existing routing
  page.tsx              # Homepage that composes everything
```

- Navbar and Footer **must** live in `components/shared/`.
- Homepage composes: `Navbar` → `Hero` → **at least 3 content sections** → `Footer`.
- Prefer server components where possible; use client components only when interactivity/animation requires it (`"use client"`).

---

## 4. Navbar (Header)

**Location:** `components/shared/navbar.tsx`

**Requirements:**

- Logo on the **left** (use existing logo asset/component if available; otherwise a clean text/logo mark consistent with the design system).
- **Right side:**
  - If **not logged in** → primary “Sign In” button (links to existing auth route, e.g. `/login` or `/sign-in`).
  - If **logged in** → “Dashboard” button (links to existing dashboard route, e.g. `/dashboard`).
- Detect auth state using the project’s existing auth solution (session, context, hook, middleware, etc.). Do **not** invent a new auth pattern.
- Sticky or fixed top is fine if it matches the design language; keep it minimal and clean.
- Fully responsive (mobile menu only if necessary; prefer a clean single-row layout that works on small screens).
- No heavy dropdowns or clutter. Logo + one CTA is the core.

---

## 5. Footer

**Location:** `components/shared/footer.tsx`

**Requirements:**

- Minimal.
- Logo (same as header or simplified).
- Short footer text (e.g. product name + “© {year}. All rights reserved.” or a one-line tagline).
- Optional: subtle divider or very light links only if they already exist elsewhere in the product.
- Fully responsive; centered or simple left-aligned layout is fine.
- No large multi-column link farms unless the design system already uses them.

---

## 6. Hero Section

**Requirements:**

- Professional, clean, modern.
- Clear value proposition for an **Order Management System with RBAC**.
- Headline + short supporting subtext.
- Primary CTA (e.g. “Get Started” / “Sign In” / “Go to Dashboard” depending on auth state — reuse the same logic as Navbar).
- Optional secondary CTA if it fits the design system.
- Subtle background treatment (gradient, soft shape, or grid) — keep it minimal, not flashy.
- Responsive typography and spacing (large on desktop, comfortable on mobile).
- Light entrance animation (fade + slight rise) if Framer Motion or CSS transitions are already in the project.

---

## 7. Content Sections (Minimum 3, Excluding Navbar / Footer / Hero)

Build **at least three** distinct sections below the hero. Each should feel purposeful for an order-management + RBAC product. Suggested set (adapt naming/copy to the project’s tone):

### Section A — Features / Capabilities
- 3–6 feature cards or a clean grid.
- Focus on: order tracking, role-based access, real-time status, auditability, multi-role workflows (Admin, Manager, Staff, etc.).
- Icons from the project’s icon set (Lucide, etc.).
- Hover states and subtle motion if animation tools are available.

### Section B — How It Works / Workflow
- Simple 3–4 step horizontal or vertical flow.
- Example: Create order → Assign roles & permissions → Track & fulfill → Review & report.
- Clear, scannable, minimal text.

### Section C — Roles & Security (RBAC highlight)
- Showcase role-based access as a product strength.
- Cards or rows for typical roles (Admin, Manager, Operator, Viewer) with short permission summaries.
- Emphasize security, least privilege, and clarity.

### Optional extra (nice-to-have)
- Social proof / stats strip, or a short “Why us” block — only if it stays minimal and on-brand.

**Layout & polish for all sections:**

- Consistent max-width container and vertical rhythm with the rest of the app.
- Generous but not excessive whitespace.
- Fully responsive (stack on mobile, grid/flex on larger screens).
- Subtle scroll-triggered or hover animations only if the stack already supports them; otherwise clean CSS transitions.

---

## 8. Design & UX Guidelines

- **Modern, clean, minimalistic, attractive, user-friendly.**
- Prefer the project’s existing color tokens, typography, radius, shadows, and spacing scale.
- High contrast for text; accessible focus states.
- No decorative clutter. Every element should earn its place.
- Mobile-first responsive design; test conceptually for sm / md / lg / xl.
- Buttons, cards, and inputs must use the shared UI components from the project’s library (e.g. shadcn/ui).
- Animations: purposeful and restrained (150–400 ms). Prefer Framer Motion or CSS if already installed; do not add heavy new dependencies without reason.

---

## 9. Technical Constraints

- Match the existing framework conventions (App Router, file naming, `"use client"` boundaries).
- No hardcoded secrets or mock auth that conflicts with real auth.
- Reuse existing utilities, cn() helpers, and design tokens.
- Keep the homepage self-contained; avoid coupling to unfinished features.
- Ensure the page builds and runs with the current `package.json` scripts.

---

## 10. Implementation Order

1. Read `agents.md`, `README.md`, and `package.json`.
2. Inspect auth pattern and existing shared UI components.
3. Create `components/shared/navbar.tsx`.
4. Create `components/shared/footer.tsx`.
5. Build the homepage (`page.tsx`) with:
   - Hero
   - ≥ 3 content sections
6. Wire auth-aware CTA (Sign In vs Dashboard) in both Navbar and Hero.
7. Apply responsive layout and light animations.
8. Self-check: no lint/type errors, consistent spacing, works without JS for core content where possible.

---

## 11. Acceptance Criteria

- [ ] Navbar: logo left + Sign In (or Dashboard when authenticated).
- [ ] Footer: minimal, logo + footer text.
- [ ] Hero: professional, clear value prop, auth-aware CTA.
- [ ] At least **3** additional sections (features, workflow, RBAC/roles recommended).
- [ ] Navbar & Footer live under `components/shared/`.
- [ ] Fully responsive across common breakpoints.
- [ ] Uses project UI library and design tokens.
- [ ] Modern, clean, minimal, animated where appropriate.
- [ ] No unnecessary new dependencies.
- [ ] Follows patterns from `agents.md` and `README.md`.

---

## 12. Out of Scope

- Building full auth flows, dashboard, or other pages.
- Changing global theme or installing large new UI libraries.
- Backend/API work.
- Over-animating or adding complex 3D/particle effects.

---

**When finished:** Summarize the files created/updated and briefly note how auth state is detected for the Sign In / Dashboard switch.