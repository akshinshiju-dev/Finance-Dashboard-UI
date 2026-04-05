# FinFlow — Finance Dashboard UI

> A clean, interactive, and visually rich **Finance Dashboard** built with React + Vite.
> Submitted by **Aakshin Shiju** for the Zorvyn Frontend Developer Intern assignment.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

### 1. Dashboard Overview
- **Summary Cards** — Total Balance, Total Income, Total Expenses, Savings Rate (with live progress bar)
- **Line Chart** — 6-month Income vs Expenses trend (Chart.js)
- **Doughnut Chart** — Spending breakdown by category with top-4 legend
- **Recent Transactions** — Latest 8 entries with category icons

### 2. Transactions Section
- Full transaction list (60+ mock entries across 6 months)
- **Filter** by type (Income/Expense) and category
- **Sort** by date, amount, or description (asc/desc)
- **Global search** from the header
- Pagination (10 per page)
- **CSV Export** — download filtered transactions

### 3. Role-Based UI (RBAC Simulation)
Use the **Role Selector** in the sidebar to switch between:

| Role | Permissions |
|------|-------------|
| 👁️ Viewer | Read-only — sees all data, no edit controls |
| 🛡️ Admin | Full access — Add, Edit, Delete transactions |

No backend required — state managed entirely in the frontend.

### 4. Insights Section
- **Top Expense Category** with percentage share
- **Monthly Expense Change** (% vs previous month)
- **Best Savings Month** with amount saved
- **Monthly Comparison Bar Chart** — Income vs Expenses per month
- **Category Breakdown** — horizontal progress bars ranked by spend

### 5. State Management
- **React Context + useReducer** — centralized state for transactions, filters, role, theme, and active page
- **localStorage persistence** — all data (including added/edited transactions) survives page refresh

### 6. UI/UX
- **Dark / Light mode** toggle (top-right moon/sun icon)
- Glassmorphism card design with subtle hover animations
- Fully **responsive** — works on mobile, tablet, and desktop
- Empty state handling when no transactions match filters
- Smooth CSS animations and micro-interactions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Vanilla CSS with CSS Custom Properties |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| State | React Context + useReducer |
| Persistence | localStorage |
| Fonts | Inter (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx        # Global state (transactions, role, theme, filters)
├── data/
│   └── mockData.js           # 60+ mock transactions + category config
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx       # Navigation + role selector
│   │   └── Header.jsx        # Search + theme toggle + avatar
│   ├── dashboard/
│   │   ├── SummaryCards.jsx  # Balance / Income / Expense / Savings cards
│   │   ├── BalanceTrendChart.jsx  # Line chart – 6 month trend
│   │   └── SpendingChart.jsx      # Doughnut chart – category breakdown
│   ├── transactions/
│   │   ├── TransactionList.jsx    # Table with filters, sort, pagination
│   │   └── TransactionModal.jsx   # Add / Edit transaction form
│   └── insights/
│       └── InsightsPanel.jsx      # Insights cards + bar chart + category bars
├── pages/
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   └── InsightsPage.jsx
├── styles/
│   ├── global.css            # Design tokens, reset, typography, utilities
│   ├── layout.css            # Sidebar, header, app layout
│   └── components.css        # Cards, table, modal, charts, insights
└── App.jsx                   # Root shell + page router
```

---

## 🎨 Design Decisions

- **Dark-first design** with a light mode toggle — common in finance apps for reduced eye strain
- **Glassmorphism cards** with gradient accents for a premium look
- **CSS Custom Properties** for the entire design token system — easy theming without any CSS framework
- **No routing library** — simple state-based navigation keeps the bundle lean
- **Mock data** spans 6 months across 10 categories (Salary, Freelance, Housing, Food, Transport, etc.) for realistic chart visualisation

---

## 📦 Optional Enhancements Implemented

- [x] Dark / Light mode toggle
- [x] localStorage data persistence  
- [x] CSV export of (filtered) transactions  
- [x] Animations and smooth transitions  
- [x] Advanced filtering (type + category + text search + sort)

---

## 🧑‍💻 Author

**Aakshin Shiju**  
akshinshiju@gmail.com  
Frontend Developer Intern Candidate — Zorvyn FinTech Pvt. Ltd.
