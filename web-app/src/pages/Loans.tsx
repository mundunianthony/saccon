import { ColumnDef } from "@tanstack/react-table";
import { useDataFetch } from "@/hooks/useDataFetch";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
// types
import { LoanProps } from "@/types";

// table columns
const columns: ColumnDef<LoanProps>[] = [
  {
    header: "Loan ID",
    accessorKey: "loan_id",
  },
  {
    header: "Account",
    accessorKey: "account",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Status",
    accessorKey: "loan_status",
  },
];

const Loans = () => {
  const { data, loading, error } = useDataFetch<LoanProps>("loans");

  // Show loading indicator when loading
  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  // handling error
  if (error)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Error : {error.message}
      </div>
    );

  return (
    <>
      <DataTable
        title="Loans"
        route="/loans/edit"
        btnTitle="Create Loan"
        data={data}
        columns={columns}
        filters="account"
      />
    </>
  );
};

export default Loans;