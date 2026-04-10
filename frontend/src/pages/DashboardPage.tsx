import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import {
  addGoal,
  addEmi,
  addTransaction,
  fetchDashboard,
  requestAiAdvice,
  searchEmi,
  updateEmi,
  updatePlanner,
  updateProfile,
} from "../store/slices/budgetSlice";

const currencySymbols: Record<string, string> = {
  INR: "Rs.",
  USD: "$",
  EUR: "EUR ",
  GBP: "GBP ",
};

const menuItems = [
  { id: "analytics", label: "Analytics", icon: "◔" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "planner", label: "Planner", icon: "◫" },
  { id: "emi", label: "EMI Tracker", icon: "◎" },
  { id: "goals", label: "Goals", icon: "◈" },
  { id: "profile", label: "Profile", icon: "◌" },
  { id: "coach", label: "AI Coach", icon: "✦" },
] as const;

const titleOptions = ["Mr", "Ms", "Mrs", "Mx"] as const;
const designationOptions = [
  "Government Servant",
  "Software Developer",
  "Software Engineer",
  "Teacher",
  "Doctor",
  "Nurse",
  "Accountant",
  "Bank Employee",
  "Sales Executive",
  "Business Owner",
  "Plumber",
  "Carpenter",
  "Electrician",
  "Mechanic",
  "Student",
  "Homemaker",
  "Other",
] as const;
const sidebarItems = [
  { id: "analytics", label: "Analytics", icon: "\u25f7" },
  { id: "transactions", label: "Transactions", icon: "\u21c6" },
  { id: "planner", label: "Planner", icon: "\u25a6" },
  { id: "emi", label: "EMI Tracker", icon: "\u25ce" },
  { id: "goals", label: "Goals", icon: "\u25c8" },
  { id: "profile", label: "Profile", icon: "\u263b" },
  { id: "settings", label: "Settings", icon: "\u2699" },
  { id: "coach", label: "AI Coach", icon: "\u2726" },
] as const;
type MenuSection = (typeof sidebarItems)[number]["id"];

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username } = useAppSelector((state) => state.auth);
  const { summary, transactions, status, error, profile, planner, goals, aiAdvice, analytics, emiTrackers } =
    useAppSelector((state) => state.budget);

  const [activeSection, setActiveSection] = useState<MenuSection>("analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const [profileForm, setProfileForm] = useState({
    title: "Mr",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    occupationOther: "",
    company: "",
    age: "",
    imageUrl: "",
    currencyCode: "INR",
  });

  const [plannerForm, setPlannerForm] = useState({
    monthlySalary: "",
    emergencyFundTarget: "",
    currencyCode: "INR",
  });

  const [goalForm, setGoalForm] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    monthsToTarget: "",
  });
  const [emiForm, setEmiForm] = useState({
    id: "",
    title: "",
    lender: "",
    monthlyEmi: "",
    monthsRemaining: "",
    startDate: "",
    endDate: "",
  });
  const [emiSearchForm, setEmiSearchForm] = useState({
    month: "",
    fromDate: "",
    toDate: "",
  });

  const [advicePrompt, setAdvicePrompt] = useState(
    "I want to manage my salary safely and save for a bigger future goal.",
  );
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    setProfileForm({
      title: profile.title || "Mr",
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      occupation: designationOptions.includes(profile.occupation as (typeof designationOptions)[number]) ? profile.occupation : "Other",
      occupationOther: designationOptions.includes(profile.occupation as (typeof designationOptions)[number]) ? "" : profile.occupation,
      company: profile.company,
      age: String(profile.age || 18),
      imageUrl: profile.imageUrl,
      currencyCode: profile.currencyCode || "INR",
    });
  }, [profile]);

  useEffect(() => {
    setPlannerForm({
      monthlySalary: planner.monthlySalary ? String(planner.monthlySalary) : "",
      emergencyFundTarget: planner.emergencyFundTarget ? String(planner.emergencyFundTarget) : "",
      currencyCode: planner.currencyCode || "INR",
    });
  }, [planner]);

  useEffect(() => {
    const pendingToast = sessionStorage.getItem("budget_toast_message") ?? "";
    if (!pendingToast) {
      return;
    }
    setToastMessage(pendingToast);
    sessionStorage.removeItem("budget_toast_message");
    const timeout = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, []);

  const currencyCode = planner.currencyCode || profile.currencyCode || "INR";
  const currencySymbol = useMemo(() => currencySymbols[currencyCode] ?? "", [currencyCode]);
  const displayName = profile.fullName || username;
  const displayRole = [profile.occupation, profile.company].filter(Boolean).join(" at ") || "Budget user";
  const titledName = [profile.title, displayName].filter(Boolean).join(" ");
  const hasAnalyticsData =
    analytics.dailySpend.amount > 0 ||
    analytics.monthlySpend.amount > 0 ||
    analytics.yearlySpend.amount > 0 ||
    transactions.length > 0;
  const upcomingEmis = useMemo(
    () => emiTrackers.filter((emi) => new Date(emi.endDate) >= new Date()).sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [emiTrackers],
  );

  const formatMoney = (amountValue: number) => `${currencySymbol}${amountValue.toFixed(2)}`;
  const getAvatarText = (title: string, name: string) => {
    const source = name.trim();
    if (!source) {
      return title || "BF";
    }
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  };
  const sidebarInitial = (displayName || username || "U").trim().charAt(0).toUpperCase();
  const renderAvatar = (imageUrl: string, title: string, name: string, className: string) =>
    imageUrl ? (
      <img alt={name || "Profile"} src={imageUrl} />
    ) : (
      <div className={`${className} avatar-fallback`}>{getAvatarText(title, name)}</div>
    );
  const renderEmptyState = (title: string, message: string) => (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setProfileForm((current) => ({ ...current, imageUrl: value }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleTransactionSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(
      addTransaction({
        title,
        category,
        type,
        amount: Number(amount),
        date: new Date().toISOString().slice(0, 10),
      }),
    );
    setTitle("");
    setAmount("");
    setCategory("Food");
    setType("EXPENSE");
  };

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(
      updateProfile({
        title: profileForm.title,
        fullName: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
        occupation: profileForm.occupation === "Other" ? profileForm.occupationOther : profileForm.occupation,
        company: profileForm.company,
        age: Number(profileForm.age),
        imageUrl: profileForm.imageUrl,
        currencyCode: profileForm.currencyCode,
      }),
    );
  };

  const handlePlannerSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(
      updatePlanner({
        monthlySalary: Number(plannerForm.monthlySalary),
        emergencyFundTarget: Number(plannerForm.emergencyFundTarget),
        currencyCode: plannerForm.currencyCode,
      }),
    );
  };

  const handleGoalSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(
      addGoal({
        title: goalForm.title,
        targetAmount: Number(goalForm.targetAmount),
        savedAmount: Number(goalForm.savedAmount),
        monthsToTarget: Number(goalForm.monthsToTarget),
      }),
    );
    setGoalForm({
      title: "",
      targetAmount: "",
      savedAmount: "",
      monthsToTarget: "",
    });
  };

  const handleAdviceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(requestAiAdvice(advicePrompt));
  };

  const handleEmiSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      title: emiForm.title,
      lender: emiForm.lender,
      monthlyEmi: Number(emiForm.monthlyEmi),
      monthsRemaining: Number(emiForm.monthsRemaining),
      startDate: emiForm.startDate,
      endDate: emiForm.endDate,
    };

    if (emiForm.id) {
      await dispatch(updateEmi({ emiId: Number(emiForm.id), payload }));
    } else {
      await dispatch(addEmi(payload));
    }

    setEmiForm({
      id: "",
      title: "",
      lender: "",
      monthlyEmi: "",
      monthsRemaining: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleEmiSearch = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(searchEmi(emiSearchForm));
  };

  const renderAnalytics = () => (
    <div className="section-stack">
      <section className="stats-grid">
        <article className="metric-card metric-card--warning">
          <div className="metric-card__label">{analytics.dailySpend.label}</div>
          <div className="metric-card__value">{formatMoney(analytics.dailySpend.amount)}</div>
          <div className="metric-card__sub">{analytics.dailySpend.period}</div>
        </article>
        <article className="metric-card metric-card--danger">
          <div className="metric-card__label">{analytics.monthlySpend.label}</div>
          <div className="metric-card__value">{formatMoney(analytics.monthlySpend.amount)}</div>
          <div className="metric-card__sub">{analytics.monthlySpend.period}</div>
        </article>
        <article className="metric-card metric-card--neutral">
          <div className="metric-card__label">{analytics.yearlySpend.label}</div>
          <div className="metric-card__value">{formatMoney(analytics.yearlySpend.amount)}</div>
          <div className="metric-card__sub">{analytics.yearlySpend.period}</div>
        </article>
        <article className="metric-card metric-card--success">
          <div className="metric-card__label">{analytics.balanceInHand.label}</div>
          <div className="metric-card__value">{formatMoney(analytics.balanceInHand.amount)}</div>
          <div className="metric-card__sub">{analytics.balanceInHand.period}</div>
        </article>
      </section>

      <section className="overview-grid">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Weekly spending</h3>
              <p className="muted">Color intensity indicates higher expense load.</p>
            </div>
          </div>
          {hasAnalyticsData ? <div className="chart-grid">
            {analytics.weeklyTrend.map((point) => {
              const height = Math.max(18, Math.min(120, point.amount));
              return (
                <div key={point.label} className="chart-item">
                  <div
                    className={`chart-bar ${point.amount > 120 ? "chart-bar--danger" : point.amount > 50 ? "chart-bar--warning" : "chart-bar--calm"}`}
                    style={{ height }}
                  />
                  <strong>{point.label}</strong>
                  <span>{formatMoney(point.amount)}</span>
                </div>
              );
            })}
          </div> : renderEmptyState("No analytics found", "Add transactions to see your current weekly spending trend.")}
        </article>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Balance overview</h3>
              <p className="muted">Current month money position</p>
            </div>
          </div>
          <div className="summary-list">
            <div className="summary-pill summary-pill--income">
              <span>Income</span>
              <strong>{formatMoney(summary.monthlyIncome)}</strong>
            </div>
            <div className="summary-pill summary-pill--expense">
              <span>Expenses</span>
              <strong>{formatMoney(summary.monthlySpent)}</strong>
            </div>
            <div className="summary-pill summary-pill--balance">
              <span>Balance in hand</span>
              <strong>{formatMoney(summary.savings)}</strong>
            </div>
            <div className="summary-pill summary-pill--budget">
              <span>Suggested safe spend</span>
              <strong>{formatMoney(summary.monthlyBudget)}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="overview-grid">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Monthly trend</h3>
              <p className="muted">Spending pattern across the year</p>
            </div>
          </div>
          {hasAnalyticsData ? <div className="trend-list">
            {analytics.monthlyTrend.map((point) => (
              <div key={point.label} className="trend-row">
                <span>{point.label}</span>
                <div className="trend-track">
                  <div className="trend-fill" style={{ width: `${Math.min(100, point.amount / 4)}%` }} />
                </div>
                <strong>{formatMoney(point.amount)}</strong>
              </div>
            ))}
          </div> : renderEmptyState("No yearly analytics found", "Yearly analytics will appear after you add real transactions.")}
        </article>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Category spending</h3>
              <p className="muted">Where your money is going</p>
            </div>
          </div>
          {analytics.categoryBreakdown.length ? <div className="trend-list">
            {analytics.categoryBreakdown.map((item) => (
              <div key={item.category} className="trend-row">
                <span>{item.category}</span>
                <div className="trend-track">
                  <div className="trend-fill trend-fill--alt" style={{ width: `${Math.min(100, item.amount / 4)}%` }} />
                </div>
                <strong>{formatMoney(item.amount)}</strong>
              </div>
            ))}
          </div> : renderEmptyState("No category data found", "Expense categories will appear here after you add spending data.")}
        </article>
      </section>

      <section className="overview-grid">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Upcoming EMI</h3>
              <p className="muted">Current active loans and installments.</p>
            </div>
          </div>
          {upcomingEmis.length ? (
            <div className="goal-list">
              {upcomingEmis.map((emi) => (
                <div className="goal-item" key={emi.id}>
                  <div>
                    <strong>{emi.title}</strong>
                    <div className="transaction-type">{emi.lender} | ends {emi.endDate}</div>
                  </div>
                  <div className="goal-metric">{formatMoney(emi.monthlyEmi)}</div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState("No upcoming EMI found", "Your future EMI schedule will appear here once you add one.")
          )}
        </article>
      </section>
    </div>
  );

  const renderTransactions = () => (
    <div className="section-stack">
      <section className="overview-grid">
        <form className="panel-card" onSubmit={handleTransactionSubmit}>
          <div className="section-heading">
            <div>
              <h3>Add transaction</h3>
              <p className="muted">Track income and expenses without leaving the dashboard.</p>
            </div>
          </div>
          <div className="form-stack compact-grid">
            <label className="field-label">
              Title
              <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="field-label">
              Amount
              <input className="field-input" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </label>
            <label className="field-label">
              Category
              <select className="field-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Food</option>
                <option>Transport</option>
                <option>Shopping</option>
                <option>Salary</option>
                <option>Side Income</option>
                <option>Trading</option>
                <option>Business</option>
                <option>Freelance</option>
                <option>Bills</option>
                <option>Health</option>
                <option>Lifestyle</option>
              </select>
            </label>
            <label className="field-label">
              Type
              <select className="field-select" value={type} onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
          </div>
          <button className="primary-button" type="submit">Save transaction</button>
        </form>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <h3>Latest transactions</h3>
              <p className="muted">Live transaction data from the backend</p>
            </div>
          </div>
          <div className="transaction-list">
            {transactions.length ? transactions.map((transaction) => (
              <div className="transaction-item" key={transaction.id}>
                <div>
                  <strong>{transaction.title}</strong>
                  <div className="transaction-type">
                    {transaction.category} | {transaction.date}
                  </div>
                </div>
                <div className={transaction.type === "INCOME" ? "positive" : "negative"}>
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatMoney(transaction.amount)}
                </div>
              </div>
            )) : renderEmptyState("No transactions found", "Add your first income or expense to start tracking live data.")}
          </div>
        </article>
      </section>
    </div>
  );

  const renderPlanner = () => (
    <section className="overview-grid">
      <form className="panel-card" onSubmit={handlePlannerSubmit}>
        <div className="section-heading">
          <div>
            <h3>Salary planner</h3>
            <p className="muted">Split salary into safe categories.</p>
          </div>
        </div>
        <div className="form-stack compact-grid">
          <label className="field-label">
            Monthly salary
            <input className="field-input" type="number" value={plannerForm.monthlySalary} onChange={(e) => setPlannerForm((c) => ({ ...c, monthlySalary: e.target.value }))} required />
          </label>
          <label className="field-label">
            Emergency target
            <input className="field-input" type="number" value={plannerForm.emergencyFundTarget} onChange={(e) => setPlannerForm((c) => ({ ...c, emergencyFundTarget: e.target.value }))} required />
          </label>
          <label className="field-label">
            Currency
            <select className="field-select" value={plannerForm.currencyCode} onChange={(e) => setPlannerForm((c) => ({ ...c, currencyCode: e.target.value }))}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
        </div>
        <button className="primary-button" type="submit">Update planner</button>
      </form>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <h3>Suggested split</h3>
            <p className="muted">Generated from your current salary.</p>
          </div>
        </div>
        <div className="allocation-grid">
          {planner.allocations.length ? planner.allocations.map((allocation) => (
            <div key={allocation.category} className="allocation-item">
              <div>
                <strong>{allocation.category}</strong>
                <div className="transaction-type">{allocation.percentage}% of salary</div>
              </div>
              <strong>{formatMoney(allocation.amount)}</strong>
            </div>
          )) : renderEmptyState("No planner data found", "Set your salary and emergency target to generate a live planner split.")}
        </div>
      </article>
    </section>
  );

  const renderGoals = () => (
    <section className="overview-grid">
      <form className="panel-card" onSubmit={handleGoalSubmit}>
        <div className="section-heading">
          <div>
            <h3>Future purchase goal</h3>
            <p className="muted">Plan devices, travel, or any big purchase.</p>
          </div>
        </div>
        <div className="form-stack compact-grid">
          <label className="field-label">
            Goal
            <input className="field-input" value={goalForm.title} onChange={(e) => setGoalForm((c) => ({ ...c, title: e.target.value }))} required />
          </label>
          <label className="field-label">
            Target amount
            <input className="field-input" type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm((c) => ({ ...c, targetAmount: e.target.value }))} required />
          </label>
          <label className="field-label">
            Already saved
            <input className="field-input" type="number" value={goalForm.savedAmount} onChange={(e) => setGoalForm((c) => ({ ...c, savedAmount: e.target.value }))} required />
          </label>
          <label className="field-label">
            Months to target
            <input className="field-input" type="number" value={goalForm.monthsToTarget} onChange={(e) => setGoalForm((c) => ({ ...c, monthsToTarget: e.target.value }))} required />
          </label>
        </div>
        <button className="primary-button" type="submit">Add goal</button>
      </form>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <h3>Goal tracker</h3>
            <p className="muted">See the monthly saving recommendation.</p>
          </div>
        </div>
        <div className="goal-list">
          {goals.length ? goals.map((goal) => (
            <div className="goal-item" key={goal.id}>
              <div>
                <strong>{goal.title}</strong>
                <div className="transaction-type">
                  Saved {formatMoney(goal.savedAmount)} of {formatMoney(goal.targetAmount)}
                </div>
              </div>
              <div className="goal-metric">{formatMoney(goal.recommendedMonthlySaving)}/month</div>
            </div>
          )) : renderEmptyState("No goals found", "Add a financial goal to track monthly saving recommendations.")}
        </div>
      </article>
    </section>
  );

  const renderEmi = () => (
    <section className="overview-grid">
      <div className="section-stack">
        <form className="panel-card" onSubmit={handleEmiSubmit}>
          <div className="section-heading">
            <div>
              <h3>{emiForm.id ? "Edit EMI" : "Create EMI / Loan"}</h3>
              <p className="muted">EMI is subtracted from salary while showing balance in hand.</p>
            </div>
          </div>
          <div className="form-stack compact-grid">
            <label className="field-label">
              Loan title
              <input className="field-input" value={emiForm.title} onChange={(e) => setEmiForm((c) => ({ ...c, title: e.target.value }))} required />
            </label>
            <label className="field-label">
              Lender
              <input className="field-input" value={emiForm.lender} onChange={(e) => setEmiForm((c) => ({ ...c, lender: e.target.value }))} required />
            </label>
            <label className="field-label">
              Monthly EMI
              <input className="field-input" type="number" value={emiForm.monthlyEmi} onChange={(e) => setEmiForm((c) => ({ ...c, monthlyEmi: e.target.value }))} required />
            </label>
            <label className="field-label">
              Months remaining
              <input className="field-input" type="number" value={emiForm.monthsRemaining} onChange={(e) => setEmiForm((c) => ({ ...c, monthsRemaining: e.target.value }))} required />
            </label>
            <label className="field-label">
              Start date
              <input className="field-input" type="date" value={emiForm.startDate} onChange={(e) => setEmiForm((c) => ({ ...c, startDate: e.target.value }))} required />
            </label>
            <label className="field-label">
              End date
              <input className="field-input" type="date" value={emiForm.endDate} onChange={(e) => setEmiForm((c) => ({ ...c, endDate: e.target.value }))} required />
            </label>
          </div>
          <button className="primary-button" type="submit">{emiForm.id ? "Update EMI" : "Save EMI"}</button>
        </form>

        <form className="panel-card" onSubmit={handleEmiSearch}>
          <div className="section-heading">
            <div>
              <h3>Search EMI tracker</h3>
              <p className="muted">Filter by month or by date range.</p>
            </div>
          </div>
          <div className="form-stack compact-grid">
            <label className="field-label">
              Month prefix
              <input className="field-input" placeholder="2026-04" value={emiSearchForm.month} onChange={(e) => setEmiSearchForm((c) => ({ ...c, month: e.target.value }))} />
            </label>
            <label className="field-label">
              From date
              <input className="field-input" type="date" value={emiSearchForm.fromDate} onChange={(e) => setEmiSearchForm((c) => ({ ...c, fromDate: e.target.value }))} />
            </label>
            <label className="field-label">
              To date
              <input className="field-input" type="date" value={emiSearchForm.toDate} onChange={(e) => setEmiSearchForm((c) => ({ ...c, toDate: e.target.value }))} />
            </label>
          </div>
          <button className="primary-button" type="submit">Search EMI</button>
        </form>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <h3>EMI tracker list</h3>
            <p className="muted">Select any EMI to edit it.</p>
          </div>
        </div>
        <div className="goal-list">
          {emiTrackers.length ? emiTrackers.map((emi) => (
            <button
              key={emi.id}
              type="button"
              className="goal-item goal-item--interactive"
              onClick={() =>
                setEmiForm({
                  id: String(emi.id),
                  title: emi.title,
                  lender: emi.lender,
                  monthlyEmi: String(emi.monthlyEmi),
                  monthsRemaining: String(emi.monthsRemaining),
                  startDate: emi.startDate,
                  endDate: emi.endDate,
                })
              }
            >
              <div>
                <strong>{emi.title}</strong>
                <div className="transaction-type">
                  {emi.lender} | {emi.startDate} to {emi.endDate}
                </div>
              </div>
              <div className="goal-metric">
                {formatMoney(emi.monthlyEmi)} x {emi.monthsRemaining}
              </div>
            </button>
          )) : renderEmptyState("No EMI found", "Add an EMI or loan to track upcoming installments here.")}
        </div>
      </article>
    </section>
  );

  const renderProfile = () => (
    <form className="panel-card" onSubmit={handleProfileSubmit}>
      <div className="section-heading">
        <div>
          <h3>Profile</h3>
          <p className="muted">Personal, contact, work, and image details.</p>
        </div>
      </div>
      <div className="profile-layout">
        <div className="profile-preview">
          {renderAvatar(profileForm.imageUrl, profileForm.title, profileForm.fullName, "profile-avatar")}
          <div>
            <strong>{[profileForm.title, profileForm.fullName].filter(Boolean).join(" ") || username}</strong>
            <div className="transaction-type">{[profileForm.occupation, profileForm.company].filter(Boolean).join(" at ") || "Budget user"}</div>
          </div>
        </div>
        <div className="form-stack compact-grid profile-fields">
          <label className="field-label">
            Title
            <select className="field-select" value={profileForm.title} onChange={(e) => setProfileForm((c) => ({ ...c, title: e.target.value }))}>
              {titleOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Full name
            <input className="field-input" value={profileForm.fullName} onChange={(e) => setProfileForm((c) => ({ ...c, fullName: e.target.value }))} required />
          </label>
          <label className="field-label">
            Email
            <input className="field-input" type="email" value={profileForm.email} onChange={(e) => setProfileForm((c) => ({ ...c, email: e.target.value }))} required />
          </label>
          <label className="field-label">
            Phone
            <input className="field-input" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={profileForm.phone} onChange={(e) => setProfileForm((c) => ({ ...c, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} required />
          </label>
          <label className="field-label">
            Age
            <input className="field-input" type="number" value={profileForm.age} onChange={(e) => setProfileForm((c) => ({ ...c, age: e.target.value }))} required />
          </label>
          <label className="field-label">
            Address
            <input className="field-input" value={profileForm.address} onChange={(e) => setProfileForm((c) => ({ ...c, address: e.target.value }))} required />
          </label>
          <label className="field-label">
            Designation
            <select className="field-select" value={profileForm.occupation} onChange={(e) => setProfileForm((c) => ({ ...c, occupation: e.target.value }))}>
              {designationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {profileForm.occupation === "Other" ? (
            <label className="field-label">
              Enter designation
              <input className="field-input" value={profileForm.occupationOther} onChange={(e) => setProfileForm((c) => ({ ...c, occupationOther: e.target.value }))} required />
            </label>
          ) : null}
          <label className="field-label">
            Company
            <input className="field-input" value={profileForm.company} onChange={(e) => setProfileForm((c) => ({ ...c, company: e.target.value }))} required />
          </label>
          <label className="field-label">
            Image URL
            <input className="field-input" value={profileForm.imageUrl} onChange={(e) => setProfileForm((c) => ({ ...c, imageUrl: e.target.value }))} placeholder="Paste an image URL or upload below" />
          </label>
          <label className="field-label">
            Upload image
            <input className="field-input" type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      </div>
      <button className="primary-button" type="submit">Save profile</button>
    </form>
  );

  const renderCoach = () => renderAnalytics();

  const renderSection = () => {
    switch (activeSection) {
      case "transactions":
        return renderTransactions();
      case "planner":
        return renderPlanner();
      case "goals":
        return renderGoals();
      case "emi":
        return renderEmi();
      case "profile":
        return renderProfile();
      case "settings":
        return renderProfile();
      case "coach":
        return renderCoach();
      case "analytics":
      default:
        return renderAnalytics();
    }
  };

  return (
    <div className="budget-layout">
      {isSidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside className={`budget-sidebar ${isSidebarOpen ? "budget-sidebar--open" : ""}`}>
        <div className="sidebar-rail">
          <div className="budget-brand budget-brand--compact budget-brand--profile">
            <div className="sidebar-brand-avatar sidebar-brand-avatar--initial">{sidebarInitial}</div>
            <div className="sidebar-brand-text">
              <strong>{displayName}</strong>
            </div>
          </div>

          <nav className="sidebar-menu">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                className={`sidebar-menu__item sidebar-menu__item--rail ${activeSection === item.id ? "sidebar-menu__item--active" : ""}`}
                onClick={() => {
                  if (item.id === "coach") {
                    setIsCoachOpen(true);
                  } else {
                    setActiveSection(item.id);
                    setIsCoachOpen(false);
                  }
                  setIsSidebarOpen(false);
                }}
              >
                <span className="sidebar-menu__icon">{item.icon}</span>
                <span className="sidebar-menu__tooltip">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer sidebar-footer--rail">
            <div className="topbar-chip">{currencyCode}</div>
            <button className="ghost-button ghost-button--rail" type="button" onClick={handleLogout}>
              ↩
            </button>
          </div>
        </div>
      </aside>

      <main className="budget-main">
        <header className="budget-main__header">
          <div className="budget-main__header-row">
            <div>
              <p className="muted">Budget dashboard</p>
              <h1 className="title">Welcome, {displayName}</h1>
              <p className="subtitle">
                Current year analytics, latest transactions, profile insights, and upcoming EMI updates all stay tied to your own workspace.
              </p>
            </div>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}
        {toastMessage ? <div className="success-banner toast-banner toast-banner--floating">{toastMessage}</div> : null}
        {status === "loading" ? <div className="panel-card">Loading dashboard...</div> : null}

        {renderSection()}

        <button
          type="button"
          className="floating-coach-button"
          onClick={() => setIsCoachOpen((current) => !current)}
          aria-label="Open AI coach"
        >
          <span className="floating-coach-button__bubble">
            <span className="floating-coach-button__dot" />
          </span>
          <span className="floating-coach-button__label">AI</span>
        </button>

        {isCoachOpen ? (
          <div className="floating-coach-panel">
            <div className="chatbot-icon">
              <span className="chatbot-icon__bubble">
                <span className="chatbot-icon__dot" />
              </span>
              <span>AI</span>
            </div>
            <div className="section-heading">
              <div>
                <h3>AI budget coach</h3>
                <p className="muted">Available from every section of the dashboard.</p>
              </div>
              <button type="button" className="ghost-button" onClick={() => setIsCoachOpen(false)}>
                Close
              </button>
            </div>

            <form className="form-stack" onSubmit={handleAdviceSubmit}>
              <label className="field-label">
                Ask for advice
                <textarea
                  className="field-input field-textarea"
                  value={advicePrompt}
                  onChange={(e) => setAdvicePrompt(e.target.value)}
                />
              </label>
              <button className="primary-button" type="submit">
                Get advice
              </button>
            </form>

            <div className="advice-list" style={{ marginTop: "18px" }}>
              <div className="advice-item">{aiAdvice.summary}</div>
              {aiAdvice.suggestions.length ? aiAdvice.suggestions.map((suggestion) => (
                <div className="advice-item" key={suggestion}>
                  {suggestion}
                </div>
              )) : renderEmptyState("No advice found", "Add planner or transaction data to generate guidance.")}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardPage;
