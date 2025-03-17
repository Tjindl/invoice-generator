document.addEventListener('DOMContentLoaded', function() {
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const numberOfDays = document.getElementById('numberOfDays');
    const issuedAmount = document.getElementById('issuedAmount');
    const receivedAmount = document.getElementById('receivedAmount');
    const totalBalance = document.getElementById('totalBalance');
    const ratePerDay = document.getElementById('ratePerDay');
    const rateRs = document.getElementById('rateRs');
    const finalAmount = document.getElementById('finalAmount');
    const addEntryButton = document.getElementById('addEntry');
    const entriesBody = document.getElementById('entriesBody');
    const totalAmountCell = document.getElementById('totalAmountCell');
    const customerName = document.getElementById('customerName');
    const billNumber = document.getElementById('billNumber');
    const billDate = document.getElementById('billDate');
    const printButton = document.getElementById('printButton');
    
    // Set today's date as default bill date
    billDate.valueAsDate = new Date();

    let entries = [];
    let previousBalance = 0;  // Keep track of previous balance

    // Calculate days between dates
    function calculateDays() {
        if (fromDate.value && toDate.value) {
            const start = new Date(fromDate.value);
            const end = new Date(toDate.value);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including both start and end dates
                numberOfDays.value = diffDays;
                calculateRateRs();
                calculateFinalAmount();
            } else {
                alert('To date must be equal to or after From date');
                toDate.value = fromDate.value;
            }
        }
    }

    // Calculate total balance including previous balance
    function calculateBalance() {
        const issued = parseFloat(issuedAmount.value) || 0;
        const received = parseFloat(receivedAmount.value) || 0;
        const currentBalance = issued - received;
        totalBalance.value = (currentBalance + previousBalance).toFixed(2);
        calculateRateRs();
        calculateFinalAmount();
    }

    // Calculate rate in Rs.
    function calculateRateRs() {
        const total = parseFloat(totalBalance.value) || 0;
        const rate = parseFloat(ratePerDay.value) || 0;
        rateRs.value = (total * rate).toFixed(2);
        calculateFinalAmount();
    }

    // Calculate final amount
    function calculateFinalAmount() {
        const rate = parseFloat(rateRs.value) || 0;
        const days = parseInt(numberOfDays.value) || 0;
        finalAmount.value = (rate * days).toFixed(2);
    }

    // Add entry to table
    function addEntry() {
        if (!fromDate.value || !toDate.value || !issuedAmount.value || !receivedAmount.value || !ratePerDay.value) {
            alert('Please fill in all fields');
            return;
        }

        const entry = {
            fromDate: fromDate.value,
            toDate: toDate.value,
            days: numberOfDays.value,
            issued: issuedAmount.value,
            received: receivedAmount.value,
            balance: totalBalance.value,
            ratePerDay: ratePerDay.value,
            rateRs: rateRs.value,
            amount: finalAmount.value,
            previousBalance: previousBalance  // Store for recalculation if needed
        };

        entries.push(entry);
        previousBalance = parseFloat(totalBalance.value);  // Update previous balance for next entry
        updateTable();
        clearForm();
    }

    // Update table with all entries
    function updateTable() {
        entriesBody.innerHTML = '';
        let totalAmount = 0;

        entries.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(entry.fromDate)}</td>
                <td>${formatDate(entry.toDate)}</td>
                <td>${entry.days}</td>
                <td>${entry.issued}</td>
                <td>${entry.received}</td>
                <td>${entry.balance}</td>
                <td>${entry.ratePerDay}</td>
                <td>${entry.rateRs}</td>
                <td>${entry.amount}</td>
                <td><button class="delete-button" onclick="deleteEntry(${index})">Delete</button></td>
            `;
            entriesBody.appendChild(row);
            totalAmount += parseFloat(entry.amount);
        });

        totalAmountCell.textContent = totalAmount.toFixed(2);
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    // Clear form inputs
    function clearForm() {
        fromDate.value = '';
        toDate.value = '';
        numberOfDays.value = '';
        issuedAmount.value = '';
        receivedAmount.value = '';
        totalBalance.value = '';
        ratePerDay.value = '';
        rateRs.value = '';
        finalAmount.value = '';
    }

    // Delete entry
    window.deleteEntry = function(index) {
        entries.splice(index, 1);
        // Recalculate all balances after deletion
        if (entries.length > 0) {
            let runningBalance = 0;
            entries.forEach((entry, i) => {
                const issued = parseFloat(entry.issued);
                const received = parseFloat(entry.received);
                entry.previousBalance = runningBalance;
                entry.balance = (issued - received + runningBalance).toFixed(2);
                runningBalance = parseFloat(entry.balance);
                
                // Update rateRs and amount based on new balance
                entry.rateRs = (parseFloat(entry.balance) * parseFloat(entry.ratePerDay)).toFixed(2);
                entry.amount = (parseFloat(entry.rateRs) * parseFloat(entry.days)).toFixed(2);
            });
            previousBalance = runningBalance;
        } else {
            previousBalance = 0;
        }
        updateTable();
    };

    // Format currency
    function formatCurrency(amount) {
        return parseFloat(amount).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    }

    // Generate PDF function
    async function generatePDF() {
        if (!customerName.value || !billNumber.value || !billDate.value) {
            alert('Please fill in all customer details before generating PDF');
            return;
        }

        if (entries.length === 0) {
            alert('Please add at least one entry before generating PDF');
            return;
        }

        // Update PDF content
        document.getElementById('pdf-customer-name').textContent = customerName.value;
        document.getElementById('pdf-bill-number').textContent = billNumber.value;
        document.getElementById('pdf-bill-date').textContent = new Date(billDate.value).toLocaleDateString('en-IN');

        const pdfTable = document.getElementById('pdf-table');
        pdfTable.innerHTML = `
            <thead>
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Issued</th>
                    <th>Received</th>
                    <th>Balance</th>
                    <th>Rate/Day</th>
                    <th>Rate Rs.</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${entries.map(entry => `
                    <tr>
                        <td>${formatDate(entry.fromDate)}</td>
                        <td>${formatDate(entry.toDate)}</td>
                        <td>${entry.days}</td>
                        <td>${formatCurrency(entry.issued)}</td>
                        <td>${formatCurrency(entry.received)}</td>
                        <td>${formatCurrency(entry.balance)}</td>
                        <td>${formatCurrency(entry.ratePerDay)}</td>
                        <td>${formatCurrency(entry.rateRs)}</td>
                        <td>${formatCurrency(entry.amount)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="8" class="text-right"><strong>Total Amount:</strong></td>
                    <td><strong>${formatCurrency(totalAmountCell.textContent)}</strong></td>
                </tr>
            </tfoot>
        `;

        const element = document.getElementById('pdf-content');
        element.style.display = 'block';

        const opt = {
            margin: [15, 15, 15, 15],
            filename: `invoice-${billNumber.value}.pdf`,
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
    }

    // Event listeners
    fromDate.addEventListener('change', calculateDays);
    toDate.addEventListener('change', calculateDays);
    issuedAmount.addEventListener('input', calculateBalance);
    receivedAmount.addEventListener('input', calculateBalance);
    ratePerDay.addEventListener('input', calculateRateRs);
    addEntryButton.addEventListener('click', addEntry);
    printButton.addEventListener('click', generatePDF);
    numberOfDays.addEventListener('input', calculateFinalAmount);
});