export const CATEGORIES = [
  'Housing', 'Food & Dining', 'Transportation', 'Entertainment',
  'Healthcare', 'Shopping', 'Utilities', 'Salary', 'Freelance', 'Investment'
];

export const CATEGORY_COLORS = {
  'Housing': '#6C63FF',
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Entertainment': '#FFE66D',
  'Healthcare': '#A8E6CF',
  'Shopping': '#FF8B94',
  'Utilities': '#B8B8FF',
  'Salary': '#51CF66',
  'Freelance': '#74C0FC',
  'Investment': '#FFA94D',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialTransactions = [
  // January
  { id: generateId(), date: '2025-01-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000 },
  { id: generateId(), date: '2025-01-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-01-10', description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 4200 },
  { id: generateId(), date: '2025-01-12', description: 'Uber Rides', category: 'Transportation', type: 'expense', amount: 1800 },
  { id: generateId(), date: '2025-01-15', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 649 },
  { id: generateId(), date: '2025-01-18', description: 'Freelance Project - Web Dev', category: 'Freelance', type: 'income', amount: 25000 },
  { id: generateId(), date: '2025-01-20', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 2100 },
  { id: generateId(), date: '2025-01-22', description: 'Restaurant Dinner', category: 'Food & Dining', type: 'expense', amount: 1850 },
  { id: generateId(), date: '2025-01-25', description: 'Clothing - Myntra', category: 'Shopping', type: 'expense', amount: 3200 },
  { id: generateId(), date: '2025-01-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 10000 },

  // February
  { id: generateId(), date: '2025-02-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000 },
  { id: generateId(), date: '2025-02-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-02-09', description: 'Swiggy Orders', category: 'Food & Dining', type: 'expense', amount: 3500 },
  { id: generateId(), date: '2025-02-12', description: 'Metro Card Recharge', category: 'Transportation', type: 'expense', amount: 500 },
  { id: generateId(), date: '2025-02-14', description: 'Valentine\'s Dinner', category: 'Food & Dining', type: 'expense', amount: 4200 },
  { id: generateId(), date: '2025-02-16', description: 'Doctor Visit', category: 'Healthcare', type: 'expense', amount: 800 },
  { id: generateId(), date: '2025-02-18', description: 'Freelance Project - Mobile App', category: 'Freelance', type: 'income', amount: 35000 },
  { id: generateId(), date: '2025-02-20', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 1200 },
  { id: generateId(), date: '2025-02-25', description: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 5600 },
  { id: generateId(), date: '2025-02-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 10000 },

  // March
  { id: generateId(), date: '2025-03-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 85000 },
  { id: generateId(), date: '2025-03-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-03-10', description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', amount: 5100 },
  { id: generateId(), date: '2025-03-12', description: 'Petrol', category: 'Transportation', type: 'expense', amount: 3000 },
  { id: generateId(), date: '2025-03-15', description: 'Spotify Premium', category: 'Entertainment', type: 'expense', amount: 119 },
  { id: generateId(), date: '2025-03-18', description: 'Medicines', category: 'Healthcare', type: 'expense', amount: 1200 },
  { id: generateId(), date: '2025-03-20', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 2300 },
  { id: generateId(), date: '2025-03-22', description: 'Freelance - UI Design', category: 'Freelance', type: 'income', amount: 18000 },
  { id: generateId(), date: '2025-03-25', description: 'Flipkart Big Sale', category: 'Shopping', type: 'expense', amount: 8900 },
  { id: generateId(), date: '2025-03-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 10000 },

  // April
  { id: generateId(), date: '2025-04-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 90000 },
  { id: generateId(), date: '2025-04-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-04-10', description: 'Zomato Orders', category: 'Food & Dining', type: 'expense', amount: 4800 },
  { id: generateId(), date: '2025-04-13', description: 'Car Service', category: 'Transportation', type: 'expense', amount: 5500 },
  { id: generateId(), date: '2025-04-16', description: 'Movie Tickets', category: 'Entertainment', type: 'expense', amount: 950 },
  { id: generateId(), date: '2025-04-18', description: 'Gym Membership', category: 'Healthcare', type: 'expense', amount: 2500 },
  { id: generateId(), date: '2025-04-20', description: 'Water & Gas Bill', category: 'Utilities', type: 'expense', amount: 1400 },
  { id: generateId(), date: '2025-04-22', description: 'Freelance - SEO Consulting', category: 'Freelance', type: 'income', amount: 15000 },
  { id: generateId(), date: '2025-04-25', description: 'Nike Shoes', category: 'Shopping', type: 'expense', amount: 7200 },
  { id: generateId(), date: '2025-04-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 15000 },

  // May
  { id: generateId(), date: '2025-05-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 90000 },
  { id: generateId(), date: '2025-05-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-05-10', description: 'Grocery & Vegetables', category: 'Food & Dining', type: 'expense', amount: 3900 },
  { id: generateId(), date: '2025-05-14', description: 'Flight Tickets', category: 'Transportation', type: 'expense', amount: 12000 },
  { id: generateId(), date: '2025-05-16', description: 'Disney+ Hotstar', category: 'Entertainment', type: 'expense', amount: 299 },
  { id: generateId(), date: '2025-05-18', description: 'Health Checkup', category: 'Healthcare', type: 'expense', amount: 3500 },
  { id: generateId(), date: '2025-05-20', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 2800 },
  { id: generateId(), date: '2025-05-23', description: 'Freelance - Content Writing', category: 'Freelance', type: 'income', amount: 8000 },
  { id: generateId(), date: '2025-05-26', description: 'Home Decor', category: 'Shopping', type: 'expense', amount: 6500 },
  { id: generateId(), date: '2025-05-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 15000 },

  // June
  { id: generateId(), date: '2025-06-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 90000 },
  { id: generateId(), date: '2025-06-07', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 22000 },
  { id: generateId(), date: '2025-06-10', description: 'Restaurant Outing', category: 'Food & Dining', type: 'expense', amount: 5600 },
  { id: generateId(), date: '2025-06-12', description: 'Petrol', category: 'Transportation', type: 'expense', amount: 3200 },
  { id: generateId(), date: '2025-06-15', description: 'Cricket Tickets - IPL', category: 'Entertainment', type: 'expense', amount: 4500 },
  { id: generateId(), date: '2025-06-18', description: 'Dental Checkup', category: 'Healthcare', type: 'expense', amount: 1500 },
  { id: generateId(), date: '2025-06-20', description: 'Electricity & Internet', category: 'Utilities', type: 'expense', amount: 3200 },
  { id: generateId(), date: '2025-06-22', description: 'Freelance - App Development', category: 'Freelance', type: 'income', amount: 45000 },
  { id: generateId(), date: '2025-06-25', description: 'Smartwatch - Boat', category: 'Shopping', type: 'expense', amount: 9800 },
  { id: generateId(), date: '2025-06-28', description: 'SIP Investment', category: 'Investment', type: 'expense', amount: 15000 },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
