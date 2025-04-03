import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDataFetch } from "@/hooks/useDataFetch";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// types
import { LoanProps, TransactionProps } from "@/types";

const DashBoard = () => {
  const { totalCustomers, totalAccountBalance, totalLoans, totalWithdrawals } =
    useDashboardData();
  const { data: transactions } = useDataFetch<TransactionProps[]>("transactions"); // Ensure type is an array
  const { data: loans } = useDataFetch<LoanProps[]>("loans"); // Ensure type is an array

  // Validate and provide fallbacks for transactions and loans
  const validatedTransactions = Array.isArray(transactions) ? transactions : [];
  const validatedLoans = Array.isArray(loans) ? loans : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Customer Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Account Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAccountBalance}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Withdrawals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Amount Withdrawn
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Loans Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLoans}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Loans Section */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Transactions Table */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/transactions">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validatedTransactions.length > 0 ? (
                  validatedTransactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell>{transaction.account || "N/A"}</TableCell>
                      <TableCell>{transaction.transaction_type || "N/A"}</TableCell>
                      <TableCell>${transaction.amount || 0}</TableCell>
                      <TableCell>
                        {transaction.transaction_date
                          ? new Date(transaction.transaction_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No transactions available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Loans</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex justify-between gap-4 text-sm">
              <div>Account No.</div>
              <div>Status</div>
              <div>Amount</div>
            </div>
            {validatedLoans.length > 0 ? (
              validatedLoans.slice(0, 10).map((loan) => (
                <div key={loan.loan_id} className="flex justify-between gap-4">
                  <div>{loan.account || "N/A"}</div>
                  <div>
                    <Badge className="text-xs" variant="outline">
                      {loan.loan_status || "N/A"}
                    </Badge>
                  </div>
                  <div className="font-medium">${loan.amount || 0}</div>
                </div>
              ))
            ) : (
              <div className="text-center">No loans available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoard;