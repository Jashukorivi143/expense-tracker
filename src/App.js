import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const CATEGORIES = [
  { name: "Food", icon: "🍜", color: "#f97316" },
  { name: "Transport", icon: "🚗", color: "#3b82f6" },
  { name: "Shopping", icon: "🛍️", color: "#a855f7" },
  { name: "Health", icon: "💊", color: "#22c55e" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Bills", icon: "📄", color: "#eab308" },
  { name: "Education", icon: "📚", color: "#06b6d4" },
  { name: "Other", icon: "📦", color: "#94a3b8" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const initialBudgets = { Food: 5000, Transport: 3000, Shopping: 4000, Health: 2000, Entertainment: 2000, Bills: 6000, Education: 3000, Other: 2000 };

const sampleTransactions = [
  { id: 1, type: "income", amount: 50000, category: "Other", desc: "Monthly Salary", date: "2026-04-01" },
  { id: 2, type: "expense", amount: 1200, category: "Food", desc: "Groceries", date: "2026-04-03" },
  { id: 3, type: "expense", amount: 800, category: "Transport", desc: "Metro Pass", date: "2026-04-04" },
  { id: 4, type: "expense", amount: 2500, category: "Shopping", desc: "Clothes", date: "2026-04-06" },
  { id: 5, type: "expense", amount: 600, category: "Food", desc: "Dinner Out", date: "2026-04-08" },
  { id: 6, type: "expense", amount: 1500, category: "Bills", desc: "Electricity Bill", date: "2026-04-10" },
  { id: 7, type: "expense", amount: 999, category: "Entertainment", desc: "Netflix + Spotify", date: "2026-04-12" },
  { id: 8, type: "expense", amount: 3500, category: "Education", desc: "Online Course", date: "2026-04-15" },
  { id: 9, type: "income", amount: 8000, category: "Other", desc: "Freelance Work", date: "2026-04-16" },
  { id: 10, type: "expense", amount: 450, category: "Health", desc: "Medicine", date: "2026-04-18" },
];

export default function App() {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({ type: "expense", amount: "", category: "Food", desc: "", date: new Date().toISOString().split("T")[0] });
  const [budgetEdit, setBudgetEdit] = useState({ ...initialBudgets });
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(null), 3000);
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expByCategory = CATEGORIES.map(c => ({
    ...c,
    spent: transactions.filter(t => t.type === "expense" && t.category === c.name).reduce((s, t) => s + t.amount, 0),
    budget: budgets[c.name] || 0,
  }));

  const pieData = expByCategory.filter(c => c.spent > 0).map(c => ({ name: c.name, value: c.spent, color: c.color }));

  const monthlyData = MONTHS.map((m, i) => {
    const income = transactions.filter(t => t.type === "income" && new Date(t.date).getMonth() === i).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense" && new Date(t.date).getMonth() === i).reduce((s, t) => s + t.amount, 0);
    return { month: m, Income: income, Expense: expense };
  });

  const filtered = transactions
    .filter(t => filter === "all" || t.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const addTransaction = () => {
    if (!form.amount || !form.desc) { notify("Fill all fields!", "error"); return; }
    const t = { ...form, id: Date.now(), amount: parseFloat(form.amount) };
    setTransactions(prev => [t, ...prev]);
    setForm({ type: "expense", amount: "", category: "Food", desc: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    notify(t.type === "income" ? "💰 Income added!" : "💸 Expense recorded!");
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    notify("Transaction deleted", "error");
  };

  const saveBudgets = () => {
    setBudgets({ ...budgetEdit });
    notify("✅ Budgets updated!");
  };

  const getCat = (name) => CATEGORIES.find(c => c.name === name) || CATEGORIES[7];

  const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#f1f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a24; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .tab { cursor: pointer; padding: 10px 20px; border-radius: 10px; font-weight: 500; font-size: 14px; transition: all 0.2s; color: #94a3b8; border: none; background: transparent; }
        .tab.active { background: #1e293b; color: #f1f5f9; }
        .tab:hover:not(.active) { color: #cbd5e1; }
        .card { background: #161620; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; }
        .btn { cursor: pointer; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 10px 20px; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px #6366f155; }
        .btn-danger { background: #ff4d6d22; color: #ff4d6d; padding: 6px 12px; font-size: 12px; border: 1px solid #ff4d6d33; }
        .btn-danger:hover { background: #ff4d6d33; }
        .inp { background: #1e293b; border: 1px solid #334155; border-radius: 10px; color: #f1f5f9; padding: 10px 14px; font-size: 14px; width: 100%; outline: none; transition: border 0.2s; font-family: inherit; }
        .inp:focus { border-color: #6366f1; }
        .inp option { background: #1e293b; }
        .stat-card { background: linear-gradient(135deg, #161620, #1a1a2e); border: 1px solid #1e293b; border-radius: 16px; padding: 20px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.08; }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .notif { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 12px; font-weight: 500; font-size: 14px; z-index: 9999; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .progress-bar { height: 6px; border-radius: 4px; background: #1e293b; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .overlay { position: fixed; inset: 0; background: #00000088; z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal { background: #161620; border: 1px solid #334155; border-radius: 20px; padding: 28px; width: 420px; max-width: 95vw; }
        label { font-size: 13px; color: #94a3b8; margin-bottom: 6px; display: block; font-weight: 500; }
        .tx-row { border-bottom: 1px solid #1e293b; padding: 14px 0; display: flex; align-items: center; gap: 14px; transition: background 0.2s; }
        .tx-row:last-child { border-bottom: none; }
        .icon-circle { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notif" style={{ background: notification.type === "error" ? "#ff4d6d22" : "#22c55e22", border: `1px solid ${notification.type === "error" ? "#ff4d6d55" : "#22c55e55"}`, color: notification.type === "error" ? "#ff4d6d" : "#22c55e" }}>
          {notification.msg}
        </div>
      )}

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 20 }}>New Transaction</h3>
              <button className="btn" style={{ background: "#1e293b", color: "#94a3b8", padding: "6px 12px" }} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {/* Type Toggle */}
            <div style={{ display: "flex", background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: 18 }}>
              {["expense", "income"].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, cursor: "pointer", background: form.type === t ? (t === "income" ? "#22c55e" : "#f97316") : "transparent", color: form.type === t ? "white" : "#94a3b8", fontWeight: 600, fontSize: 14, transition: "all 0.2s", textTransform: "capitalize" }}>
                  {t === "income" ? "⬆ Income" : "⬇ Expense"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label>Description</label><input className="inp" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="e.g. Lunch at canteen" /></div>
              <div><label>Amount (₹)</label><input className="inp" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label>Category</label>
                  <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div><label>Date</label><input className="inp" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: 4, fontSize: 15 }} onClick={addTransaction}>
                {form.type === "income" ? "Add Income" : "Record Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#0d0d18", borderBottom: "1px solid #1e293b", padding: "0 24px", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, background: "linear-gradient(135deg,#a5b4fc,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SpendSense</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["dashboard", "transactions", "budget", "analytics"].map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>
                {tab === "dashboard" ? "📊" : tab === "transactions" ? "📋" : tab === "budget" ? "🎯" : "📈"} {tab}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowForm(true)}>+ Add Transaction</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { label: "Total Balance", val: balance, color: balance >= 0 ? "#22c55e" : "#f97316", icon: "💰", bg: "#22c55e" },
                { label: "Total Income", val: totalIncome, color: "#22c55e", icon: "⬆️", bg: "#22c55e" },
                { label: "Total Expenses", val: totalExpense, color: "#f97316", icon: "⬇️", bg: "#f97316" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ "--c": s.bg + "33" }} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontSize: 26, fontWeight: 700, color: s.color }}>{formatINR(Math.abs(s.val))}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{transactions.length} transactions</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>
              {/* Pie Chart */}
              <div className="card">
                <h3 style={{ fontFamily: "'Space Grotesk'", marginBottom: 16, fontSize: 16 }}>Spending by Category</h3>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" strokeWidth={0}>
                          {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={v => formatINR(v)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9", fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {pieData.map(d => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#94a3b8" }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : <div style={{ color: "#475569", textAlign: "center", padding: "40px 0" }}>No expenses yet</div>}
              </div>

              {/* Budget Progress */}
              <div className="card">
                <h3 style={{ fontFamily: "'Space Grotesk'", marginBottom: 16, fontSize: 16 }}>Budget Status</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {expByCategory.filter(c => c.budget > 0).slice(0, 5).map(c => {
                    const pct = Math.min((c.spent / c.budget) * 100, 100);
                    const over = c.spent > c.budget;
                    return (
                      <div key={c.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>{c.icon} {c.name}</span>
                          <span style={{ fontSize: 12, color: over ? "#f97316" : "#64748b" }}>{formatINR(c.spent)} / {formatINR(c.budget)}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: over ? "linear-gradient(90deg,#f97316,#ef4444)" : pct > 75 ? "linear-gradient(90deg,#eab308,#f97316)" : `linear-gradient(90deg,${c.color}99,${c.color})` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 16 }}>Recent Transactions</h3>
                <button className="btn" style={{ background: "transparent", color: "#6366f1", padding: "6px 12px", fontSize: 13, border: "1px solid #6366f133" }} onClick={() => setActiveTab("transactions")}>View All →</button>
              </div>
              {transactions.slice(0, 5).map(t => {
                const cat = getCat(t.category);
                return (
                  <div key={t.id} className="tx-row">
                    <div className="icon-circle" style={{ background: cat.color + "22" }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.desc}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{t.category} • {t.date}</div>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: t.type === "income" ? "#22c55e" : "#f97316" }}>
                      {t.type === "income" ? "+" : "-"}{formatINR(t.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 22 }}>All Transactions</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "income", "expense"].map(f => (
                  <button key={f} className="btn" onClick={() => setFilter(f)} style={{ padding: "7px 16px", background: filter === f ? "#1e293b" : "transparent", color: filter === f ? "#f1f5f9" : "#64748b", border: `1px solid ${filter === f ? "#334155" : "transparent"}`, textTransform: "capitalize", fontSize: 13 }}>{f}</button>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>No transactions found</div>
              ) : filtered.map(t => {
                const cat = getCat(t.category);
                return (
                  <div key={t.id} className="tx-row" style={{ padding: "14px 20px" }}>
                    <div className="icon-circle" style={{ background: cat.color + "22" }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.desc}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{t.category} • {t.date}</div>
                    </div>
                    <span className="badge" style={{ background: t.type === "income" ? "#22c55e22" : "#f9731622", color: t.type === "income" ? "#22c55e" : "#f97316", marginRight: 12, textTransform: "capitalize" }}>
                      {t.type}
                    </span>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: t.type === "income" ? "#22c55e" : "#f97316", minWidth: 90, textAlign: "right" }}>
                      {t.type === "income" ? "+" : "-"}{formatINR(t.amount)}
                    </div>
                    <button className="btn btn-danger" style={{ marginLeft: 12 }} onClick={() => deleteTransaction(t.id)}>Delete</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BUDGET */}
        {activeTab === "budget" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 22 }}>Budget Manager</h2>
              <button className="btn btn-primary" onClick={saveBudgets}>Save Changes</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {expByCategory.map(c => {
                const pct = c.budget > 0 ? Math.min((c.spent / c.budget) * 100, 100) : 0;
                const over = c.spent > c.budget && c.budget > 0;
                const remaining = c.budget - c.spent;
                return (
                  <div key={c.name} className="card" style={{ border: over ? `1px solid ${c.color}44` : "1px solid #1e293b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="icon-circle" style={{ background: c.color + "22" }}>{c.icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: over ? "#f97316" : "#22c55e" }}>
                            {over ? `⚠ Over by ${formatINR(Math.abs(remaining))}` : `${formatINR(Math.max(remaining, 0))} left`}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk'", color: c.color }}>{Math.round(pct)}%</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>used</div>
                      </div>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: 14 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: over ? "linear-gradient(90deg,#f97316,#ef4444)" : `linear-gradient(90deg,${c.color}88,${c.color})` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Spent: <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{formatINR(c.spent)}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>Budget:</span>
                        <input
                          className="inp"
                          type="number"
                          value={budgetEdit[c.name]}
                          onChange={e => setBudgetEdit(b => ({ ...b, [c.name]: parseFloat(e.target.value) || 0 }))}
                          style={{ width: 100, padding: "5px 10px", fontSize: 13 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 22 }}>Analytics</h2>
            <div className="card">
              <h3 style={{ fontFamily: "'Space Grotesk'", marginBottom: 20, fontSize: 16 }}>Monthly Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => formatINR(v)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9", fontSize: 13 }} />
                  <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card">
                <h3 style={{ fontFamily: "'Space Grotesk'", marginBottom: 16, fontSize: 16 }}>Category Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {expByCategory.filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent).map(c => (
                    <div key={c.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                        <span>{c.icon} {c.name}</span>
                        <span style={{ color: c.color, fontWeight: 600 }}>{formatINR(c.spent)}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(c.spent / totalExpense) * 100}%`, background: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontFamily: "'Space Grotesk'", marginBottom: 16, fontSize: 16 }}>Financial Summary</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Total Income", val: totalIncome, color: "#22c55e" },
                    { label: "Total Expenses", val: totalExpense, color: "#f97316" },
                    { label: "Net Savings", val: balance, color: balance >= 0 ? "#6366f1" : "#ef4444" },
                    { label: "Savings Rate", val: null, extra: totalIncome > 0 ? `${((balance / totalIncome) * 100).toFixed(1)}%` : "N/A", color: "#a855f7" },
                    { label: "Avg. Transaction", val: null, extra: transactions.length > 0 ? formatINR(Math.round((totalExpense + totalIncome) / transactions.length)) : "₹0", color: "#06b6d4" },
                    { label: "No. of Transactions", val: null, extra: transactions.length, color: "#eab308" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
                      <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, color: s.color }}>
                        {s.val !== null ? formatINR(s.val) : s.extra}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
