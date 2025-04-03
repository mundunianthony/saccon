import { useEffect, useState } from "react";

// Define types for API responses
interface Account {
  id: number;
  balance: number;
}

interface Transaction {
  transaction_id: number;
  account: string;
  transaction_type: string;
  amount: number;
  transaction_date: string;
}

interface Loan {
  loan_id: number;
  account: string;
  loan_status: string;
  amount: number;
}

export const useDashboardData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    // Fetch accounts
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts');
        const data = await response.json();
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccounts([]);
      }
    };

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      }
    };

    // Fetch loans
    const fetchLoans = async () => {
      try {
        const response = await fetch('/api/loans');
        const data = await response.json();
        setLoans(Array.isArray(data.loans) ? data.loans : []);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoans([]);
      }
    };

    // Fetch all data
    fetchAccounts();
    fetchTransactions();
    fetchLoans();
  }, []);

  // Calculate total account balance
  const totalAccountBalance = Array.isArray(accounts)
    ? accounts.reduce((total, account) => total + account.balance, 0)
    : 0;

  // Calculate total amount withdrawn
  const totalWithdrawals = Array.isArray(transactions)
    ? transactions
        .filter((transaction) => transaction.transaction_type === 'withdrawal')
        .reduce((total, transaction) => total + transaction.amount, 0)
    : 0;

  // Calculate total active loans
  const totalLoans = Array.isArray(loans)
    ? loans.filter((loan) => loan.loan_status === 'active').reduce((total, loan) => total + loan.amount, 0)
    : 0;

  return {
    totalAccountBalance,
    totalWithdrawals,
    totalLoans,
  };
};