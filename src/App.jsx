import { useState } from 'react'
import html2pdf from 'html2pdf.js'
import CustomerDetails from './components/CustomerDetails'
import InvoiceForm from './components/InvoiceForm'
import InvoiceTable from './components/InvoiceTable'
import PDFContent from './components/PDFContent'
import LoginScreen from './components/LoginScreen'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerData, setCustomerData] = useState({
    customerName: '',
    billNumber: '',
    billDate: new Date().toISOString().split('T')[0]
  });

  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    numberOfDays: '',
    issuedAmount: '',
    receivedAmount: '',
    totalBalance: '',
    ratePerDay: '',
    rateRs: '',
    finalAmount: '',
    productType: ''
  });

  const [entries, setEntries] = useState([]);
  const [productBalances, setProductBalances] = useState({
    Plate: 0,
    Channel: 0,
    Balli: 0,
    Farma: 0
  });

  const handleAddEntry = () => {
    const newEntry = { 
      ...formData,
      previousBalance: productBalances[formData.productType] || 0
    };
    setEntries([...entries, newEntry]);
    
    // Update the balance for this specific product type
    setProductBalances(prev => ({
      ...prev,
      [formData.productType]: parseFloat(formData.totalBalance) || 0
    }));

    // Clear form
    setFormData({
      fromDate: '',
      toDate: '',
      numberOfDays: '',
      issuedAmount: '',
      receivedAmount: '',
      totalBalance: '',
      ratePerDay: '',
      rateRs: '',
      finalAmount: '',
      productType: ''
    });
  };

  const handleDeleteEntry = (index) => {
    const newEntries = [...entries];
    const deletedEntry = newEntries[index];
    newEntries.splice(index, 1);
    
    // Recalculate balances for the specific product type
    const productType = deletedEntry.productType;
    let runningBalance = 0;
    
    const updatedEntries = newEntries.map(entry => {
      if (entry.productType === productType) {
        const issued = parseFloat(entry.issuedAmount) || 0;
        const received = parseFloat(entry.receivedAmount) || 0;
        entry.previousBalance = runningBalance;
        const currentBalance = issued - received;
        entry.totalBalance = (currentBalance + runningBalance).toFixed(2);
        runningBalance = parseFloat(entry.totalBalance);
        
        // Update rateRs and amount based on new balance
        entry.rateRs = (parseFloat(entry.totalBalance) * parseFloat(entry.ratePerDay)).toFixed(2);
        entry.finalAmount = (parseFloat(entry.rateRs) * parseInt(entry.numberOfDays)).toFixed(2);
      }
      return entry;
    });

    setEntries(updatedEntries);

    // Update the balance for this specific product type
    const lastEntryOfType = updatedEntries
      .filter(entry => entry.productType === productType)
      .pop();

    setProductBalances(prev => ({
      ...prev,
      [productType]: lastEntryOfType ? parseFloat(lastEntryOfType.totalBalance) : 0
    }));
  };

  const generatePDF = async () => {
    if (!customerData.customerName || !customerData.billNumber || !customerData.billDate) {
      alert('Please fill in all customer details before generating PDF');
      return;
    }

    if (entries.length === 0) {
      alert('Please add at least one entry before generating PDF');
      return;
    }

    const element = document.getElementById('pdf-content');
    element.style.display = 'block';
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `invoice-${customerData.billNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      alert('Error generating PDF: ' + error.message);
    } finally {
      element.style.display = 'none';
    }
  };

  const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.finalAmount || 0), 0).toFixed(2);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <h1>Estimate Generator</h1>
      
      <CustomerDetails 
        customerData={customerData} 
        setCustomerData={setCustomerData} 
      />

      <InvoiceForm 
        formData={formData}
        setFormData={setFormData}
        previousBalance={formData.productType ? productBalances[formData.productType] : 0}
        onAddEntry={handleAddEntry}
      />

      <InvoiceTable 
        entries={entries}
        onDeleteEntry={handleDeleteEntry}
      />

      <div className="print-section">
        <button onClick={generatePDF} className="print-button">
          Generate PDF
        </button>
      </div>

      <PDFContent 
        customerData={customerData}
        entries={entries}
        totalAmount={totalAmount}
      />
    </div>
  );
}

export default App;
