import React from 'react';

const InvoiceTable = ({ entries, onDeleteEntry }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  // Group entries by product type
  const groupedEntries = entries.reduce((groups, entry) => {
    const type = entry.productType || 'Unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(entry);
    return groups;
  }, {});

  // Calculate subtotal and current balance for each product type
  const getProductTypeInfo = (entries) => {
    const subtotal = entries.reduce((sum, entry) => sum + parseFloat(entry.finalAmount || 0), 0);
    const currentBalance = entries.length > 0 ? parseFloat(entries[entries.length - 1].totalBalance) : 0;
    return {
      subtotal: subtotal.toFixed(2),
      currentBalance: currentBalance.toFixed(2)
    };
  };

  return (
    <div className="table-container">
      {Object.entries(groupedEntries).map(([productType, productEntries]) => {
        const { subtotal, currentBalance } = getProductTypeInfo(productEntries);
        return (
          <div key={productType} className="product-group">
            <div className="product-header">
              <h3>{productType}</h3>
              <div className="product-summary">
                <span>Current Total: {formatCurrency(currentBalance)}</span>
              </div>
            </div>
            <table className="entries-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Issued</th>
                  <th>Received</th>
                  <th>Total</th>
                  <th>Rate/Day</th>
                  <th>Rate Rs.</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{formatDate(entry.fromDate)}</td>
                    <td>{formatDate(entry.toDate)}</td>
                    <td>{entry.numberOfDays}</td>
                    <td>{formatCurrency(entry.issuedAmount)}</td>
                    <td>{formatCurrency(entry.receivedAmount)}</td>
                    <td>{formatCurrency(entry.totalBalance)}</td>
                    <td>{formatCurrency(entry.ratePerDay)}</td>
                    <td>{formatCurrency(entry.rateRs)}</td>
                    <td>{formatCurrency(entry.finalAmount)}</td>
                    <td>
                      <button 
                        className="delete-button" 
                        onClick={() => onDeleteEntry(entries.indexOf(entry))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" className="text-right">
                    <strong>Subtotal:</strong>
                  </td>
                  <td colSpan="2">
                    <strong>{formatCurrency(subtotal)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
      <div className="total-section">
        <strong>Total Amount: {formatCurrency(
          Object.values(groupedEntries).reduce((total, entries) => 
            total + parseFloat(getProductTypeInfo(entries).subtotal), 0
          ).toFixed(2)
        )}</strong>
      </div>
    </div>
  );
};

export default InvoiceTable;