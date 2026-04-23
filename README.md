# SpendSense - Smart Expense & Budget Tracker 🧾💰

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-orange.svg)](https://recharts.org/)

# 📖 Project Overview

**The Smart Expense & Budget Tracker** is a modern web-based application designed to help users efficiently manage their daily expenses and personal budgets. Users can record income and expenses, categorize transactions, set monthly budget limits, and monitor spending patterns through an intuitive, responsive interface.

The current implementation is a fully functional **React Single Page Application (SPA)** frontend built with Create React App, featuring real-time tracking, interactive charts, and a sleek dark-mode UI. All data is managed in local state with sample transactions for demo purposes. 

**Future Expansion Planned:** Backend with Node.js/Express.js for persistent storage, user auth, reports, and notifications (client-server architecture via HTTP).

This project demonstrates full-stack concepts, starting with a polished frontend ready for backend integration.

# ✨ Features

- **📊 Interactive Dashboard**: Balance overview, income/expense stats, recent transactions.
- **📈 Beautiful Visualizations**: Pie charts (category spending), bar charts (monthly trends), progress bars (budget usage) powered by Recharts.
- **💳 Transaction Management**: Add income/expenses, categorize (Food🍜, Transport🚗, Shopping🛍️, Health💊, Entertainment🎬, Bills📄, Education📚, Other📦), delete, filter by type/date.
- **🎯 Budget Manager**: Set category budgets (e.g., Food ₹5000), track usage with color-coded progress.
- **📋 Analytics Tab**: Monthly income vs expense bars, category breakdown, financial summary (savings rate, avg txn).
- **🎨 Modern UI**: Dark theme, responsive design, animations, notifications, modal forms.
- **⚡ Zero Setup**: Runs instantly on `npm start`.

# 🛠️ Tech Stack

| Frontend | React 19, Recharts 3.8, CSS-in-JS (styled components) |
|----------|-----------------------------------------------------|
| Build    | Create React App                                   |
| Future   | Node.js/Express backend, database integration      |

# 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- npm/yarn package manager

### Installation & Run (2 minutes)
```bash
# 1. Navigate to project directory (already done)
cd c:/Users/jashw/Desktop/expense-tracker

# 2. Install dependencies (includes recharts, react-scripts etc.)
npm install

# 3. Fix any security vulnerabilities
npm audit fix --force

# 4. Start development server (localhost:3000, auto-reload)
npm start
```

**Open [http://localhost:3000](http://localhost:3000) in your browser.**

**Pro Tip**: Edit `src/App.js` for customizations - it's a single-file app!

### Build for Production
```bash
npm run build
# Serves static files from /build folder
```

### Tests
```bash
npm test
```

# 📱 Screenshots

**Dashboard**  
![Dashboard](https://via.placeholder.com/1100x600/161620/94a3b8?text=Dashboard+with+Pie+Chart+%26+Stats)  
*(Pie chart shows spending by category, stat cards for balance/income/expenses)*

**Budget Tab**  
![Budget](https://via.placeholder.com/1100x400/161620/94a3b8?text=Budget+Progress+Bars+per+Category)

**Analytics**  
![Analytics](https://via.placeholder.com/1100x600/161620/94a3b8?text=Bar+Chart+Monthly+Trends+%26+Summary)

*(Replace placeholders with actual screenshots)*

# 🎮 How to Use

1. **Add Transaction** (+ button): Choose income/expense, amount, category, description, date.
2. **Navigate Tabs**: Dashboard (overview), Transactions (list/CRUD), Budget (set limits), Analytics (insights).
3. **Delete**: Click trash on any transaction.
4. **Customize**: Edit budgets, add real data.

**Sample Budgets**: Food ₹5000, Transport ₹3000, Shopping ₹4000, etc.

## 🏗️ Project Structure
```
expense-tracker/
├── public/          # Static assets (favicon, manifest)
├── src/
│   └── App.js       # Complete app logic + UI + charts (single file!)
├── package.json     # Deps: react, recharts
└── README.md        # You're reading it!
```

## 🔮 Roadmap / Future Enhancements
- Node.js/Express backend for data persistence.
- Database (MongoDB/SQLite) & User Authentication.
- Expense reports export (PDF/CSV).
- Push notifications for budget alerts.
- Mobile PWA support.
- Multi-currency.

## 📝 License
This project is MIT licensed. See [LICENSE](LICENSE) for details.

## 🤝 Contributing
1. Fork & clone.
2. `npm install && npm start`.
3. Create PR to `main`.

**Built with ❤️ by BLACKBOXAI**  
[Star this repo! ⭐](https://github.com/) Questions? Open an issue.

---

**💡 Pro Tip**: Data resets on refresh (local state). Backend coming soon for persistence!

