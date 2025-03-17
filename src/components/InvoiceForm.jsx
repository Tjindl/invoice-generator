import React, { useEffect } from 'react';

const PRODUCT_RATES = {
  'Plate': 1.20,
  'Channel': 1.20,
  'Balli': 1.10,
  'Farma': 90
};

const InvoiceForm = ({ formData, setFormData, previousBalance, onAddEntry }) => {
  // Calculate days whenever dates change
  useEffect(() => {
    calculateDays();
  }, [formData.fromDate, formData.toDate]);

  // Calculate balance whenever issued or received amounts change or product type changes
  useEffect(() => {
    if ((formData.issuedAmount || formData.receivedAmount) && formData.productType) {
      calculateBalance();
    }
  }, [formData.issuedAmount, formData.receivedAmount, formData.productType, previousBalance]);

  // Calculate rate whenever balance or product type changes
  useEffect(() => {
    if (formData.totalBalance && formData.productType) {
      calculateRateRs();
    }
  }, [formData.totalBalance, formData.productType, formData.numberOfDays]);

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setFormData(prev => ({
          ...prev,
          numberOfDays: diffDays
        }));
      } else {
        alert('To date must be equal to or after From date');
        setFormData(prev => ({
          ...prev,
          toDate: formData.fromDate
        }));
      }
    }
  };

  const calculateBalance = () => {
    const issued = parseFloat(formData.issuedAmount) || 0;
    const received = parseFloat(formData.receivedAmount) || 0;
    const currentBalance = issued - received;
    setFormData(prev => ({
      ...prev,
      totalBalance: (currentBalance + previousBalance).toFixed(2)
    }));
  };

  const calculateRateRs = () => {
    const total = parseFloat(formData.totalBalance) || 0;
    const rate = parseFloat(formData.ratePerDay) || 0;
    const rateRs = (total * rate).toFixed(2);
    const days = parseInt(formData.numberOfDays) || 0;
    setFormData(prev => ({
      ...prev,
      rateRs: rateRs,
      finalAmount: (parseFloat(rateRs) * days).toFixed(2)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productType || !formData.fromDate || !formData.toDate || 
        !formData.issuedAmount || !formData.receivedAmount) {
      alert('Please fill in all fields');
      return;
    }
    onAddEntry();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      productType: type,
      ratePerDay: PRODUCT_RATES[type]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-form">
      <div className="product-section">
        <div className="input-group">
          <label htmlFor="productType">Product Type:</label>
          <select
            id="productType"
            value={formData.productType}
            onChange={(e) => handleProductTypeChange(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {Object.keys(PRODUCT_RATES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="date-section">
        <div className="input-group">
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            id="fromDate"
            value={formData.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            id="toDate"
            value={formData.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="numberOfDays">No. of Days:</label>
          <input
            type="number"
            id="numberOfDays"
            value={formData.numberOfDays}
            readOnly
          />
        </div>
      </div>

      <div className="balance-section">
        <div className="input-group">
          <label htmlFor="issuedAmount">Issued:</label>
          <input
            type="number"
            id="issuedAmount"
            value={formData.issuedAmount}
            onChange={(e) => handleInputChange('issuedAmount', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="receivedAmount">Received:</label>
          <input
            type="number"
            id="receivedAmount"
            value={formData.receivedAmount}
            onChange={(e) => handleInputChange('receivedAmount', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="totalBalance">Total:</label>
          <input
            type="text"
            id="totalBalance"
            value={formData.totalBalance}
            readOnly
          />
        </div>
      </div>

      <div className="rate-section">
        <div className="input-group">
          <label htmlFor="ratePerDay">Rate per Item per Day (Rs.):</label>
          <input
            type="number"
            id="ratePerDay"
            value={formData.ratePerDay}
            readOnly
          />
        </div>
        <div className="input-group">
          <label htmlFor="rateRs">Rate (Rs.):</label>
          <input
            type="text"
            id="rateRs"
            value={formData.rateRs}
            readOnly
          />
        </div>
        <div className="input-group">
          <label htmlFor="finalAmount">Amount:</label>
          <input
            type="text"
            id="finalAmount"
            value={formData.finalAmount}
            readOnly
          />
        </div>
      </div>

      <button type="submit" className="add-button">Add Entry</button>
    </form>
  );
};

export default InvoiceForm;