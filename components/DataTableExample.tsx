import React from "react";
import DataTable, { LoanRow, TableColumn } from "./DataTable";

// Example data for demonstration
const exampleData: LoanRow[] = [
  { loanId:"EXAMPLE_001", msisdn:"08012345678", telco:"MTN", amount:"₦500", outstanding:"₦100", recovered:"₦400", aging:"DP 0", fraudRisk:"Low", score:75, created:"01/01/2026" },
  { loanId:"EXAMPLE_002", msisdn:"09098765432", telco:"AIRTEL", amount:"₦1,000", outstanding:"₦500", recovered:"₦500", aging:"DP 17", fraudRisk:"Medium", score:60, created:"02/01/2026" },
];

// Example of custom column configuration
const customColumns: TableColumn[] = [
  { key: "loanId", label: "Loan ID", sortable: true },
  { key: "msisdn", label: "Phone Number", sortable: true },
  { key: "amount", label: "Loan Amount" },
  { key: "fraudRisk", label: "Risk Level" },
  { key: "action", label: "Actions" },
];

export default function DataTableExample() {
  const handleRowClick = (row: LoanRow) => {
    console.log("Row clicked:", row.loanId);
  };

  const handleActionClick = (row: LoanRow) => {
    alert(`Viewing details for loan: ${row.loanId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">DataTable Example</h2>
      
      {/* Basic usage with default columns */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
        <DataTable 
          data={exampleData}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Custom usage with specific columns */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Custom Columns</h3>
        <DataTable 
          data={exampleData}
          columns={customColumns}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
          actionLabel="Details"
        />
      </div>

      {/* Without pagination */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">No Pagination</h3>
        <DataTable 
          data={exampleData}
          paginated={false}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Without search */}
      <div>
        <h3 className="text-lg font-medium mb-2">No Search</h3>
        <DataTable 
          data={exampleData}
          searchable={false}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
}
