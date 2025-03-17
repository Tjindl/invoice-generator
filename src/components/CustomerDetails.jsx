import React from 'react';

const CustomerDetails = ({ customerData, setCustomerData }) => {
  return (
    <div className="customer-details">
      <div className="input-group">
        <label htmlFor="customerName">Customer Name:</label>
        <input
          type="text"
          id="customerName"
          value={customerData.customerName}
          onChange={(e) => setCustomerData({...customerData, customerName: e.target.value})}
        />
      </div>
      <div className="input-group">
        <label htmlFor="billNumber">Bill Number:</label>
        <input
          type="text"
          id="billNumber"
          value={customerData.billNumber}
          onChange={(e) => setCustomerData({...customerData, billNumber: e.target.value})}
        />
      </div>
      <div className="input-group">
        <label htmlFor="billDate">Bill Date:</label>
        <input
          type="date"
          id="billDate"
          value={customerData.billDate}
          onChange={(e) => setCustomerData({...customerData, billDate: e.target.value})}
        />
      </div>
    </div>
  );
};

export default CustomerDetails;