import {
  AccountProps,
  CustomerProps,
  LoanProps,
  TransactionProps,
} from "@/types";
import { useDataFetch } from "./useDataFetch";

export function useDashboardData() {
  const { data: customers } = useDataFetch<CustomerProps[]>("customers");
  const { data: accounts } = useDataFetch<AccountProps>("accounts");
  const { data: loans } = useDataFetch<LoanProps>("loans");
  const { data: transactions } = useDataFetch<TransactionProps>("transactions");

  const totalCustomers = Array.isArray(customers) ? customers.length : 0;
  const totalAccountBalance = Array.isArray(accounts)
    ? accounts.reduce((sum, account) => sum + account.balance, 0)
    : 0;
  const totalLoans = Array.isArray(loans)
    ? loans.reduce((sum, loan) => sum + loan.amount, 0)
    : 0;
  const totalWithdrawals = Array.isArray(transactions)
    ? transactions.reduce((sum, transaction) => {
        const withdrawals = transaction.transaction_type.includes("Withdrawal");
        return withdrawals ? sum + transaction.amount : sum;
      }, 0)
    : 0;

  return {
    totalCustomers: totalCustomers || 0,
    totalAccountBalance: totalAccountBalance || 0,
    totalLoans: totalLoans || 0,
    totalWithdrawals: totalWithdrawals || 0,
  };
}
