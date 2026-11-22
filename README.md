# velora_

> **Upscale Hospitality Operating System** • Complete, modern, responsive, frontend-only restaurant management system with real-time cross-role synchronization.

![velora_ brand](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80)

---

## 🍽 Overview

**velora_** is a frontend-only restaurant management system engineered with React 19, Vite, Tailwind CSS, Recharts, and Lucide React. It provides zero-backend real-time reactivity: all state is orchestrated across 5 operational roles using React Context API and persistent `localStorage` with native cross-tab synchronization.

### 🌟 Key Highlights
- **Upscale Visual Identity**: Obsidian `#18181B` header, warm amber `#D97706` primary accent, off-white `#FAFAFA` canvas, and emerald `#10B981` indicators for pure veg and settled transactions.
- **Micro-Interactions & Audio**: Native Web Audio API chime synthesis for order notifications and kitchen bell rings (zero external audio asset overhead).
- **Tabular Figures**: Formatted in Indian Rupee (`₹`) with monospace numeric styling.
- **Zero-Latency Cross-Role Sync**: An action taken in any role view (e.g. customer placing an order or kitchen plating food) immediately propagates across all role views and open browser tabs.

---

## 👥 5 Operational Role Views

### 1. 📱 Customer Experience (Mobile-First)
- **Interactive Landing & Table Selection**: Welcome screen simulating contactless QR dining table scanning across 12 live tables with dynamic Available / Occupied badges.
- **Digital Haute Menu**: Sticky table header, category filters (`Starters`, `Main Course`, `Desserts & Drinks`), live search, and Veg-only toggle.
- **Quantity Stepper**: Sleek amber "Add" button that expands into an interactive `− [qty] +` stepper.
- **Floating Cart Bar**: Real-time counter and subtotal drawer trigger.
- **Slide-over Cart & Checkout**:
  - Itemized breakdown, GST (5%) calculation, special chef requests/allergies notes.
  - **Pay Before Order**: Simulated dynamic UPI QR code with payment modal and immediate `PAID` confirmation.
  - **Pay After Meal**: Order placed with `Pay Later (Pending)` status, revealing on-demand "Settle Bill" action.
- **5-Stage Live Order Tracker**:
  1. `Order Placed` (Awaiting Manager)
  2. `Manager Approved` (Sent to Kitchen)
  3. `Cooking in Kitchen` (Chefs preparing)
  4. `Ready for Pickup` (Plated & waiter dispatched)
  5. `Served` (Delivered to table)

### 2. 📋 Manager Dashboard
- **Executive Shift Stats**: Pending review count, seated tables (out of 12), settled revenue, and active prep tickets.
- **Incoming Order Queue**: Live cards with table numbers, elapsed timers, dish breakdown, notes, and payment tags. Actions to **Approve & Send to Kitchen** or **Reject Order**.
- **Menu & Price Catalog**: Add new dishes, edit prices/descriptions inline, toggle instant **In Stock / Sold Out** (updates customer menu live), and delete items.
- **Active Tables & Billing**: Grid of all 12 tables with occupancy status and one-click **Settle Bill** for Pay-Later tabs.

### 3. 👨‍🍳 Kitchen Display System (KDS)
- **High-Contrast Prep Board**: Shows only manager-approved tickets.
- **Elapsed Timer & Urgency Badges**: Live counters transitioning from green (<10m) to amber (10–20m) to critical red (>20m).
- **Interactive Prep Checklist**: Chefs can check off plated dishes with veg/non-veg dietary indicators and kitchen notes.
- **Mark Food Ready**: One-click action that removes the ticket from KDS, sounds a pleasant ascending chime, and alerts waitstaff.

### 4. 🛎 Staff Waiter Interface (Mobile)
- **Ready-to-Serve Queue**: Visual alert banner showing plated food waiting at the pass with order numbers and table destinations.
- **Mark Served Action**: One-tap action that advances the customer tracker to `Served`.
- **Table Overview**: Fast status glance showing which tables are dining vs available.

### 5. 📊 Super Admin Panel
- **Revenue KPIs**: Gross settled revenue, total orders processed, Average Order Value (AOV), and bill settlement conversion rate.
- **Recharts Analytics**:
  - **Revenue Velocity**: Area chart with warm amber gradient showing hourly trajectory.
  - **Payment Breakdown**: Donut chart comparing UPI QR, Cards & POS, and Settled Pay-Later.
  - **Category Performance**: Bar chart comparing Starters, Mains, and Drinks.
  - **Top-Selling Leaderboard**: Ranked grossing culinary items with portion counts.
- **Live Orders Ledger**: Comprehensive searchable audit trail of all transactions.

---

## 🚀 Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### Quickstart
```bash
# 1. Clone repository & navigate to folder
cd Velora_

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit the local URL shown in your terminal (typically `http://localhost:5173`).

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔄 End-to-End Cross-Role Flow Walkthrough

Test the complete lifecycle in a single tab or across multiple split windows:

1. **Step 1 (Customer View)**:
   - Select Table 4.
   - Add *Kasundi Mustard Prawns* and *Velora Butter Chicken*.
   - Open Cart, choose **Pay After Meal**, and click **Place Order**.
   - Notice the live tracker enters **Order Placed** and a toast alert pops up.

2. **Step 2 (Manager Dashboard)**:
   - Click **Manager** on the top Role Switcher.
   - Notice the badge count update and Table 4 order waiting under **Incoming Order Queue**.
   - Click **Approve to KDS**.

3. **Step 3 (Kitchen KDS)**:
   - Click **Kitchen KDS** on the Role Switcher.
   - Table 4 ticket appears with live elapsed timer.
   - Check off dishes, then click **MARK FOOD READY**.
   - A chime plays and a pickup toast fires.

4. **Step 4 (Waiter View)**:
   - Click **Waiter View**.
   - An alert banner flashes indicating Table 4 food is waiting at the pass.
   - Click **MARK SERVED TO TABLE 4**.

5. **Step 5 (Customer & Super Admin Verification)**:
   - Switch back to **Customer**: tracker now shows stage 5 **Served**.
   - Switch to **Super Admin**: view updated revenue charts, completed orders, and top-selling leaderboard.

---

## 📁 Project Architecture

```
Velora_/
├── index.html                   # HTML entry with Plus Jakarta Sans & theme
├── package.json                 # React 19, Vite, Tailwind v4, Recharts, Lucide
├── vite.config.js               # Vite config with @tailwindcss/vite
├── eslint.config.js             # ESLint configuration
├── src/
│   ├── main.jsx                 # React root
│   ├── index.css                # Tailwind CSS v4 directives & font tabular nums
│   ├── App.jsx                  # Main application shell & role view router
│   ├── context/
│   │   ├── context.js           # Velora React context definition
│   │   ├── VeloraContext.jsx    # Unified state provider & localStorage synchronizer
│   │   ├── useVelora.js         # Custom hook for role consumers
│   │   └── index.js             # Public context exports
│   ├── data/
│   │   └── seedData.js          # Initial 12 tables, gourmet menu, and demo orders
│   ├── utils/
│   │   ├── audio.js             # Web Audio API chime synthesis
│   │   └── time.js              # Elapsed time calculations & timer hooks
│   └── components/
│       ├── common/
│       │   ├── Navbar.jsx       # Brand navigation header
│       │   ├── RoleSwitcher.jsx # Top floating role demo switcher with live badges
│       │   ├── ToastContainer.jsx # Floating toast notification queue
│       │   └── VegBadge.jsx     # Indian hospitality Veg / Non-Veg icon
│       ├── customer/
│       │   ├── CustomerView.jsx # Customer screen orchestrator
│       │   ├── TableSelector.jsx # QR code scan simulator & 12-table selector
│       │   ├── MenuSection.jsx  # Category tabs, search, veg filter & stepper
│       │   ├── CartDrawer.jsx   # Slide-over cart, payment mode & special notes
│       │   ├── PaymentModal.jsx # Simulated UPI QR & card payment modal
│       │   └── OrderTracker.jsx # 5-stage live order tracker & bill settlement
│       ├── manager/
│       │   ├── ManagerDashboard.jsx # Overview KPIs & tab container
│       │   ├── IncomingOrders.jsx # Order queue with Approve/Reject actions
│       │   ├── MenuManager.jsx  # Inline price edit, stock toggle & dish creator
│       │   └── TableBilling.jsx # 12-table billing & settlement
│       ├── kitchen/
│       │   └── KitchenKDS.jsx   # Kanban tickets, elapsed timers & Mark Ready
│       ├── waiter/
│       │   └── WaiterMobile.jsx # Ready-to-serve queue & Mark Served
│       └── admin/
│           └── SuperAdminPanel.jsx # Recharts charts, KPIs & master orders ledger
```

---

## 🛡 License
MIT License. Built for modern restaurant dining experiences.
