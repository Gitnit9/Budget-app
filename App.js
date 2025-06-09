// App.js
// React and ReactDOM are loaded via CDN in index.html
const { useState, useEffect } = React;

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [userName, setUserName] = useState('');

  const categories = [
    'Rent', 'Maintenance', 'Grocery (Bulk)', 'Grocery (Daily)', 
    'Gym Trainer', 'House Help', 'Car EMI', 'Utilities', 
    'Family payment', 'Home Loan EMI', 'Personal Loan EMI', 
    'Monthly adhoc expenses', 'Luxury', 'Other miscellaneous'
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudgets = localStorage.getItem('budgets');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addExpense = () => {
    if (!amount || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  const deleteExpense = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const setBudgetForCategory = () => {
    if (!budgetCategory || !budgetAmount) {
      alert('Please fill all fields');
      return;
    }

    setBudgets({
      ...budgets,
      [budgetCategory]: parseFloat(budgetAmount)
    });

    setBudgetCategory('');
    setBudgetAmount('');
    alert('Budget set successfully!');
  };

  const saveProfile = () => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }

    setUserProfile({ name: userName });
    alert('Profile saved successfully!');
  };

  const quickAdd = (desc, cat, amt) => {
    const newExpense = {
      id: Date.now(),
      amount: amt,
      description: desc,
      category: cat,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    alert(`Added ${desc} - ₹${amt.toLocaleString('en-IN')}`);
  };

  // Calculate totals
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const todayTotal = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const monthTotal = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);

  // Calculate category spending for current month
  const categorySpending = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

  return (
    <div className="app-container">
      <div className="header">
        <h1>💰 Budget Tracker</h1>
        <p>Personal Finance Manager</p>
        <div className="user-info">
          <div>👤 {userProfile.name || 'Set your name'}</div>
          <div>📅 {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div className="tabs">
        {[
          { id: 'dashboard', label: '🏠 Home' },
          { id: 'add', label: '➕ Add' },
          { id: 'budget', label: '🎯 Budget' },
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'profile', label: '👤 Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="section">
            <div className="stats">
              <div className="stat">
                <div className="stat-value">₹{todayTotal.toLocaleString('en-IN')}</div>
                <div className="stat-label">Today</div>
              </div>
              <div className="stat">
                <div className="stat-value">₹{monthTotal.toLocaleString('en-IN')}</div>
                <div className="stat-label">This Month</div>
              </div>
            </div>

            <div className="overview-section">
              <h4>💡 Monthly Overview</h4>
              <div className="overview-row">
                <span>Total Budget:</span>
                <span>₹{totalBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="overview-row">
                <span>Total Spent:</span>
                <span>₹{monthTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="overview-row">
                <span>Remaining:</span>
                <span>₹{(totalBudget - monthTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <h3>Recent Expenses</h3>
            <div className="expenses-list">
              {expenses.slice(0, 10).map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <h4>{expense.description}</h4>
                    <p>{expense.category} • {expense.date}</p>
                  </div>
                  <div className="expense-actions">
                    <span className="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</span>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Expense */}
        {activeTab === 'add' && (
          <div className="section">
            <h3>Quick Add</h3>
            <div className="quick-add">
              <button className="quick-btn" onClick={() => quickAdd('Monthly Rent', 'Rent', 25000)}>
                🏠 Rent<br />₹25,000
              </button>
              <button className="quick-btn" onClick={() => quickAdd('Daily Groceries', 'Grocery (Daily)', 500)}>
                🛒 Groceries<br />₹500
              </button>
              <button className="quick-btn" onClick={() => quickAdd('Gym Session', 'Gym Trainer', 1000)}>
                💪 Gym<br />₹1,000
              </button>
              <button className="quick-btn" onClick={() => quickAdd('House Help', 'House Help', 3000)}>
                🧹 House Help<br />₹3,000
              </button>
            </div>

            <h3>Add Custom Expense</h3>
            <div className="form-section">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you spend on?"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button className="btn" onClick={addExpense}>
                Add Expense
              </button>
            </div>
          </div>
        )}

        {/* Budget */}
        {activeTab === 'budget' && (
          <div className="section">
            <h3>Set Monthly Budget</h3>
            <div className="form-section">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                >
                  <option value="">Choose category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="Enter budget amount"
                />
              </div>
              <button className="btn" onClick={setBudgetForCategory}>
                Set Budget
              </button>
            </div>

            <h3>Budget Overview</h3>
            <div className="budget-list">
              {Object.entries(budgets).map(([category, budget]) => {
                const spent = categorySpending[category] || 0;
                const percentage = (spent / budget) * 100;
                const progressClass = percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : 'good';

                return (
                  <div key={category} className="budget-item">
                    <div className="budget-header">
                      <span className="budget-name">{category}</span>
                      <span className="budget-amount">
                        ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill progress-${progressClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{percentage.toFixed(0)}% used</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="section">
            <h3>Category Analysis</h3>
            <div className="analytics-list">
              {Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const budget = budgets[category] || 0;
                  const percentage = budget > 0 ? (amount / budget) * 100 : 0;
                  
                  return (
                    <div key={category} className="analytics-item">
                      <div className="analytics-info">
                        <h4>{category}</h4>
                        <p>Spent: ₹{amount.toLocaleString('en-IN')}</p>
                        {budget > 0 && <p>Budget: ₹{budget.toLocaleString('en-IN')} ({percentage.toFixed(0)}%)</p>}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="section">
            <h3>Profile Settings</h3>
            <div className="form-section">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <button className="btn" onClick={saveProfile}>
                Save Profile
              </button>
            </div>

            <h3>Data Management</h3>
            <div className="form-section">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const data = { expenses, budgets, userProfile };
                  const dataStr = JSON.stringify(data, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'budget-data.json';
                  a.click();
                }}
              >
                📤 Export Data
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data?')) {
                    setExpenses([]);
                    setBudgets({});
                    setUserProfile({});
                    localStorage.clear();
                    alert('All data cleared!');
                  }
                }}
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Render the application
ReactDOM.render(<BudgetTracker />, document.getElementById('root'));
