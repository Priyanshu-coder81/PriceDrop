# 📉 PriceDrop

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

####  **PriceDrop** is an automated price tracking tool designed to help users monitor product prices across various e-commerce platforms. It notifies users when a product's price drops below a specified threshold, ensuring they never miss a deal.

 ### **Project Link**: https://price-dropp.vercel.app/
---

## 📑 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)

---

## ✨ Features

* **Real-Time Scraping**: Utilizes **Firecrawl** to navigate complex e-commerce pages and extract accurate pricing data.
* **Automated Tracking**: Scheduled cron jobs to check for price drops periodically.
* **Secure Authentication**: Full user management (Sign Up/Login) powered by **Supabase Auth**.
* **Database Management**: Persistent storage of products, price history, and user alerts using **Supabase Database**.
* **Modern UI/UX**: Responsive and accessible components built with **Shadcn UI** and **Tailwind CSS**.
* **Proxy Support**: configured via `proxy.ts` to handle request routing and avoid rate limits.

---

## 🛠 Tech Stack

**Frontend & Backend:**
* [Next.js 15](https://nextjs.org/) (App Router)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)

**Database & Auth:**
* [Supabase](https://supabase.com/) (PostgreSQL)

**Scraping & Data:**
* [Firecrawl](https://firecrawl.dev/) (Web Scraping SDK)
* [Cheerio/Puppeteer](https://cheerio.js.org/) (Parsing fallbacks)

**UI Components:**
* [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* [Lucide React](https://lucide.dev/) (Icons)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* **Node.js** (v18+)
* **npm** or **yarn**
* A **Supabase** project (for DB & Auth)
* A **Firecrawl** API Key

### Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Scraper Configuration (Firecrawl)
FIRECRAWL_API_KEY=your_firecrawl_api_key

```

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000


##  Installation

### Clone the repository

```bash
git clone https://github.com/Priyanshu-coder81/PriceDrop.git
cd PriceDrop
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** with your browser to see the result.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable UI components (Shadcn UI)
├── lib/                  # Utility libraries and scraping logic
├── types/                # TypeScript interfaces
├── utils/
│   └── supabase/         # Supabase client initialization
├── proxy.ts              # Proxy configuration for scraping
└── public/               # Static assets
```

---

## 💡 Usage

* **Sign Up**: Create an account using the Supabase auth flow.
* **Add Product**: Paste a product URL (Amazon, Flipkart, etc.) into the search bar.
* **Track**: The app uses Firecrawl to fetch the current price and adds it to your dashboard.
* **Monitor**: Check back to see price history or wait for email notifications (if configured).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📧 Contact

**LinkedIn** – https://www.linkedin.com/in/priyanshu-verma-a12ba829a/

