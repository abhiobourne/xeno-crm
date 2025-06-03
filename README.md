# ✨ Xeno CRM Campaign Management Platform

This is a full-stack, scalable campaign management platform built with **Next.js 14 App Router**, featuring:
- AI-powered content generation
- Dynamic audience segmentation
- Batch delivery processing
- Google OAuth 2.0 authentication
- Clean, component-based architecture

---

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **MongoDB** with Mongoose
- **NextAuth** for Google OAuth 2.0
- **Material UI** for UI components
- **OpenAI / Gemini AI** for message & tag generation
- **TypeScript**
- **Vercel** for deployment

---

## 🧠 AI Integration

This app uses **Google Gemini AI** (fallback: OpenAI GPT-3.5) for:

- ✉️ **Message Suggestion Generator**  
  Dynamically suggests 3 optimized campaign messages based on rule logic.

- 🏷️ **Tag Generator**  
  Analyzes rule logic + message intent to auto-categorize campaigns with tags.

> Both features are integrated cleanly in the `Create Campaign` UI, enhancing copywriting speed and relevance.

---

## ✅ Features Overview

### 🎯 1. Campaign Creation (Segment Builder)
- Dynamic rule builder for audience segmentation
- Logical operators (`AND`, `OR`) supported
- Audience preview with backend size estimation
- AI-generated campaign messages and tags
- Full validation and error handling with loaders
- SSR-powered homepage for SEO

### 🧾 2. Campaign History & Logs
- Campaign list page with audience, sent, failed stats
- Delivery logs per campaign with customer, message, status
- Graceful fallback if no logs exist
- Pagination-ready backend structure

### 📤 3. Delivery Simulation (Backend)
- Dummy vendor API simulates 90% SENT, 10% FAILED
- Delivery Receipt API updates the `CommunicationLog` model
- Campaign stats auto-updated on delivery
- Brownie Points ✅: Consumer-driven DB update in batches (5s interval)

### 🔐 4. Authentication
- Google OAuth 2.0 using **NextAuth**
- Secure protected routes (campaign creation/history only for logged-in users)

---

## 🧹 Best Practices Used

| Practice                       | Description |
|-------------------------------|-------------|
| ✅ Linting                     | ESLint configured to maintain clean code |
| ✅ SSR for SEO                 | Home page is server-side rendered |
| ✅ Dynamic Routing             | Uses Next.js App Router dynamic segments |
| ✅ Error & Loading States      | Snackbar alerts, loading indicators |
| ✅ Code Structure              | Separated APIs, models, components, lib/ |
| ✅ GitHub + Vercel             | Source code is public on GitHub, hosted on Vercel |
| ✅ AI Tools                    | AI suggestions are optional and fast |
| ✅ Pagination-Ready APIs       | `/api/communication-logs` is built with filters in mind |

---

## 🧱 Project Structure

src/
├── app/
│ ├── page.tsx # SSR Home Page
│ ├── campaigns/ # Campaign list + dynamic logs
│ └── api/ # Backend APIs
│ ├── campaigns/ # Campaign create/list
│ ├── segments/ # Segment preview/create
│ ├── vendor/ # Simulated delivery + receipt
│ ├── communication-logs/ # Delivery log viewer
│ └── ai/ # AI endpoints (summary, suggestions)
├── lib/ # Helpers (db, models, AI handler)
│ ├── db.ts
│ ├── models/ # Mongoose models
│ └── aiHandler.ts # Gemini/OpenAI integration
├── components/ # (optional: UI components)



---

## 🔗 Deployment

- 🔐 **GitHub Repository**: [github.com/your-username/xeno-crm](https://github.com/abhiobourne/xeno-crm)
- 🌍 **Live Demo on Vercel**: [xeno-crm.vercel.app](https://xeno-crm-peach.vercel.app)

---

## 📸 Demo Video

🎥 [Google Drive](#) — Explaining rule builder, AI usage, campaign logs, and delivery simulation.
https://drive.google.com/drive/folders/1mENLV_iijIsKzrJMVglfKWOMV56VBKqa?usp=drive_link

---

## 💬 Feedback

Built with ❤️ for the **Xeno SDE Internship Assignment – 2025**.  
Looking forward to your feedback!

— **Jatin Jadon**

