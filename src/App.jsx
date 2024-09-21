import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./InvoiceGenerator.css"; // For external CSS styles

function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("2145");
  const [companyName, setCompanyName] = useState("NUTIX SOLUTIONS LLC");
  const [clientName, setClientName] = useState("Nabeel Ahmed");
  const [dateIssued, setDateIssued] = useState("2024-09-17");
  const [items, setItems] = useState([
    { description: "MO One-Stop LLC Formation Package", amount: 230 },
  ]);
  const [discountName, setDiscountName] = useState("Discount");
  const [discount, setDiscount] = useState(50);
  const [paymentTerms, setPaymentTerms] = useState(
    "Please note that a full payment of $300 (84,000 PKR) is required upfront to proceed with your ITIN application."
  );

  const handleAddItem = () => {
    setItems([...items, { description: "", amount: 0 }]);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChangeItem = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoice");
    const bankDetailsElement = document.getElementById("bank-details");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [250, 280], // Full A4 page for two sections
    });

    // Capture the first page (invoice)
    html2canvas(invoiceElement, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Add a new page for the bank details
      pdf.addPage();

      // Capture the second page (bank details)
      html2canvas(bankDetailsElement, { scale: 3, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("invoice_with_bank_details.pdf");
      });
    });
  };

  const subtotal = items.reduce((total, item) => total + Number(item.amount), 0);
  const total = subtotal - discount;

  return (
    <div>
      {/* Invoice Form */}
      <div className="input-form">
        <h2>Enter Invoice Details</h2>
        <label>Invoice Number:</label>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />

        <label>Company Name:</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <label>Client Name:</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <label>Date Issued:</label>
        <input
          type="date"
          value={dateIssued}
          onChange={(e) => setDateIssued(e.target.value)}
        />

        <label>Description:</label>
        <div id="items">
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Enter Description"
                value={item.description}
                onChange={(e) =>
                  handleChangeItem(index, "description", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Enter Amount"
                value={item.amount}
                onChange={(e) =>
                  handleChangeItem(index, "amount", e.target.value)
                }
              />
              <button type="button" onClick={() => handleDeleteItem(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>

        <label>Discount Name:</label>
        <input
          type="text"
          value={discountName}
          onChange={(e) => setDiscountName(e.target.value)}
        />

        <label>Discount (USD):</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />

        <input
          type="text"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
        />

        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      {/* Invoice Display */}
      <div className="invoice-container" id="invoice">
        <div className="invoice-header">
          <div className="logo">
            <img
              src="https://umersaleemultra.github.io/New-Filling/images/regedcds.png"
              alt="Buzz Filing"
            />
          </div>
          <div className="invoice-number">
            <p>INVOICE</p>
            <p id="display-invoice-number oli">#{invoiceNumber}</p>
          </div>
        </div>

        <div className="invoice-info">
          <p>
            <strong>Date Issued:</strong> {new Date(dateIssued).toLocaleDateString()}
          </p>
          <p>
            <strong>Company:</strong> {companyName}
          </p>
          <p>
            <strong>Client:</strong> {clientName}
          </p>
        </div>

        <div className="table-container">
          <table border="1">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>${Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td>Sub-Total</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>{discountName} (USD)</td>
                <td>${discount.toFixed(2)}</td>
              </tr>
              <tr className="total">
                <td>TOTAL</td>
                <td>${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payment-terms">
          <p>
            <strong>PAYMENT TERMS:</strong>
          </p>
          <p>{paymentTerms}</p>
        </div>

        <div className="important-info">
          <p>
            <strong>IMPORTANT:</strong>
          </p>
          <p>Bank account details are available on the next page.</p>
        </div>

        {/* Footer */}
        <div className="footer">
          <div>
            <strong>PREPARED BY:</strong> Hina Yasmeen, Head of Sales
          </div>
          <div>
            <i className="fas fa-phone-alt"></i> 0339-4882800 <br />
            <i className="fas fa-envelope"></i> hello@buzzfilling.com
          </div>
          <div>
            <i className="fas fa-map-marker-alt"></i> 2nd Floor, 172 S, P.E.C.H.S., Shams Center, Plaza Extreme Commerce, Tariq Rd, Karachi
          </div>
        </div>
      </div>
    

      <div class="container">
        <div class="payment-section">
            <div class="payment-header">IF MAKING A PAYMENT IN PKR</div>
            <div class="payment-details">
                <p><strong>Bank Name:</strong> United Bank Limited (UBL)</p>
                <p><strong>Account Title:</strong> BUZZ FILING</p>
                <p><strong>Account Number:</strong> 1176314943776</p>
                <p><strong>IBAN:</strong> PK22UNIL0109000314943776</p>
            </div>
        </div>

        <div class="payment-section">
            <div class="payment-header">IF MAKING A PAYMENT IN USD</div>
            <div class="payment-details">
                <p><strong>Bank Name:</strong> Bangor Savings</p>
                <p><strong>Bank Account Title:</strong> Hasham Usman</p>
                <p><strong>Account Type:</strong> Checking</p>
                <p><strong>Account Number:</strong> 650510940261</p>
                <p><strong>Routing Number:</strong> 011275484</p>
            </div>
        </div>

        <div className="footer">
          <div>
            <strong>PREPARED BY:</strong> Hina Yasmeen, Head of Sales
          </div>
          <div>
            <i className="fas fa-phone-alt"></i> 0339-4882800 <br />
            <i className="fas fa-envelope"></i> hello@buzzfilling.com
          </div>
          <div>
            <i className="fas fa-map-marker-alt"></i> 2nd Floor, 172 S, P.E.C.H.S., Shams Center, Plaza Extreme Commerce, Tariq Rd, Karachi
          </div>
        </div>
      </div>
    </div>

  
  );
}
export default InvoiceGenerator;
