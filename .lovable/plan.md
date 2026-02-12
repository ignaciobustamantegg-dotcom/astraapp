

# ASTRA – The Emotional Audit Protocol

A premium 7-day guided emotional audit web app that helps users decode invisible patterns in their relationships and choose between "Destiny" or "Inertia."

---

## 1. Landing Page — First Impression

A cinematic, minimal landing page that establishes ASTRA's premium identity:

- **Hero section** with Playfair Display headline (e.g., *"Decode the Invisible Architecture of Your Relationships"*) over a clean white canvas
- Subtle "Ash Gold" accent line or icon for mystical warmth
- A single bold CTA: **"Begin Your Audit"** in deep black
- Brief 3-step visual explainer: *Map → Analyze → Decide*
- Social proof or credibility strip (e.g., "Trusted by X users" — placeholder for now)
- Smooth fade-in animations on scroll for a "liquid" premium feel

---

## 2. Authentication — Seamless Entry

- **Sign up / Sign in** page with email + password, styled to match the premium aesthetic
- Minimal form with clean typography, centered layout
- After login, users are directed to the Dashboard
- User profile created automatically on signup (to track audit progress)

---

## 3. Dashboard — The Audit Command Center

The core view after login, designed mobile-first:

- **Progress header** showing current day and overall completion (e.g., "Day 1 of 7 — 14% Complete") with a slim, elegant progress bar
- **7-Day Audit Sequence** displayed as vertical timeline cards:
  - **Day 1: Identification of Inertia** — Unlocked, with a "Begin" button
  - **Days 2–7** — Locked state with subtle lock icon, day name visible but muted, creating anticipation (Zeigarnik Effect)
  - Each card shows: Day number, philosophical title, one-line descriptor, and status badge (Unlocked / Reserved / Completed)
- **"Start Audit" primary CTA** at the top for new users, transitions to "Continue Audit" for returning users
- Cards use 1px `#E5E7EB` borders, soft shadows, generous whitespace
- Smooth slide and fade transitions between states

---

## 4. Design System & Visual Identity

- **Backgrounds**: White `#FFFFFF` / Light gray `#F9FAFB`
- **Text**: Slate `#0F172A` primary, `#64748B` secondary
- **Accents**: Deep Black `#000000` for CTAs, Ash Gold `#A3906D` for reflective/mystical elements
- **Typography**: Playfair Display for headlines and philosophical quotes; Inter for interface text
- **Components**: Clean cards, minimal borders, no heavy gradients — Linear/Apple-inspired restraint
- **Animations**: Opacity fades, subtle card slides, smooth transitions throughout

---

## 5. Backend (Supabase via Lovable Cloud)

- **Auth**: Email/password signup and login
- **Profiles table**: Stores user display info, created automatically on signup
- **Audit progress table**: Tracks which day the user is on, timestamps for each day started/completed
- **Row-Level Security**: Users can only access their own data

---

## 6. Mobile-First Responsiveness

- Touch-friendly buttons (minimum 44px tap targets)
- Vertical card layout optimized for smartphone scrolling
- Typography scales gracefully across breakpoints
- Dashboard works beautifully on both mobile and desktop

