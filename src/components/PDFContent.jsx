import React from 'react';

const PDFContent = ({ customerData, entries, totalAmount }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
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

  // Calculate subtotal for each product type
  const calculateSubtotal = (entries) => {
    return entries.reduce((sum, entry) => sum + parseFloat(entry.finalAmount || 0), 0).toFixed(2);
  };

  // Get current total for product type
  const getCurrentTotal = (entries) => {
    return entries.length > 0 ? entries[entries.length - 1].totalBalance : '0.00';
  };

  return (
    <div id="pdf-content" className="pdf-content">
      <div className="company-header">
        <h1>Estimate</h1>
        <div className="invoice-details">
          <div><strong>Customer Name:</strong> {customerData.customerName}</div>
          <div><strong>Bill Number:</strong> {customerData.billNumber}</div>
          <div><strong>Bill Date:</strong> {formatDate(customerData.billDate)}</div>
        </div>
      </div>
      
      <div className="table-wrapper">
        {Object.entries(groupedEntries).map(([productType, productEntries]) => (
          <div key={productType} className="product-section">
            <div className="product-header">
              <h3>{productType}</h3>
              <div className="product-summary">
                Current Total: {formatCurrency(getCurrentTotal(productEntries))}
              </div>
            </div>
            <table className="pdf-table">
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
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" className="text-right">
                    <strong>Subtotal:</strong>
                  </td>
                  <td>
                    <strong>{formatCurrency(calculateSubtotal(productEntries))}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
        
        <div className="total-section">
          <strong>Total Amount: {formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      <div className="footer">
        <div className="signature-section">
          <div className="signature">
            <div>Customer's Signature</div>
            <div className="signature-line">_________________</div>
          </div>
          <div className="signature">
            <div>Authorized Signature</div>
            <div className="signature-line">_________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFContent;