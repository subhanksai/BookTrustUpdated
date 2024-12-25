import { useEffect, useState } from "react";

const YourFormComponent = () => {
  // Initializing state with the data you provided
  const [formData, setFormData] = useState({
    awb: "",
    balanceAmount: "",
    bankRemittanceAmount: "",
    bankRemittanceDate: "",
    bankRemittanceNo: "",
    customerId: "",
    ebrc: "",
    exchangeRate: "",
    firc: "",
    invoiceDate: "",
    invoiceNo: "",
    invoicePaidBy: "",
    invoiceRaisedOn: "",
    orderProformaNo: "",
    osrDate: "",
    osrNo: "",
    outOfRemittanceForOrder: "",
    paidByPaypal: "",
    paypalInvoiceAmount: "",
    paypalInvoiceDate: "",
    paypalInvoiceNo: "",
    paypalTransactionId: "",
    sb: "",
    sbAddress: "",
    sbFilingDate: "",
    sbRealisedDate: "",
    sbSubmitted: "",
    sbd: "",
    slNo: "",
    totalOrderValue: "",
    yesNoOption: "",
  });

  // Assuming you're fetching the data (use your API or static data)
  useEffect(() => {
    const fetchedData = {
      awb: "2323",
      balanceAmount: "23242",
      bankRemittanceAmount: "232",
      bankRemittanceDate: "2024-12-03T00:00:00.000Z",
      bankRemittanceNo: "CITIN24557288988",
      customerId: "ANEESHA TALLAVAJJULA",
      ebrc: "34r23re23",
      exchangeRate: "81.33616845",
      firc: "SF07938",
      invoiceDate: "2024-12-25T00:00:00.000Z",
      invoiceNo: "654345",
      invoicePaidBy: "OSR12971",
      invoiceRaisedOn: "Mallikarjuna Sastry Tallavajjula",
      orderProformaNo: "64137",
      osrDate: "2024-12-18T00:00:00.000Z",
      osrNo: "22.11.2024",
      outOfRemittanceForOrder: "19,480.83",
      paidByPaypal: "239.51",
      paypalInvoiceAmount: "232",
      paypalInvoiceDate: "2024-12-18T00:00:00.000Z",
      paypalInvoiceNo: "254321",
      paypalTransactionId: "92F64653EH309672X",
      sb: "2324",
      sbAddress: "gbsdfvasgsegsrtgesrtgdf",
      sbFilingDate: "2024-12-03T00:00:00.000Z",
      sbRealisedDate: "2024-12-02T00:00:00.000Z",
      sbSubmitted: "",
      sbd: "23232",
      slNo: "156",
      totalOrderValue: "53423",
      yesNoOption: "no",
    };
    setFormData(fetchedData); // Set the fetched data to the state
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData); // Logs the modified data
  };

  // Handle change for inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        AWB:
        <input
          type="text"
          name="awb"
          value={formData.awb}
          onChange={handleChange}
        />
      </label>

      <label>
        Balance Amount:
        <input
          type="text"
          name="balanceAmount"
          value={formData.balanceAmount}
          onChange={handleChange}
        />
      </label>

      <label>
        Bank Remittance Amount:
        <input
          type="text"
          name="bankRemittanceAmount"
          value={formData.bankRemittanceAmount}
          onChange={handleChange}
        />
      </label>

      <label>
        Bank Remittance Date:
        <input
          type="date"
          name="bankRemittanceDate"
          value={formData.bankRemittanceDate.split("T")[0]} // Formatting to date
          onChange={handleChange}
        />
      </label>

      <label>
        Bank Remittance No:
        <input
          type="text"
          name="bankRemittanceNo"
          value={formData.bankRemittanceNo}
          onChange={handleChange}
        />
      </label>

      <label>
        Customer ID:
        <input
          type="text"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
        />
      </label>

      <label>
        EBRC:
        <input
          type="text"
          name="ebrc"
          value={formData.ebrc}
          onChange={handleChange}
        />
      </label>

      <label>
        Exchange Rate:
        <input
          type="text"
          name="exchangeRate"
          value={formData.exchangeRate}
          onChange={handleChange}
        />
      </label>

      <label>
        FIRC:
        <input
          type="text"
          name="firc"
          value={formData.firc}
          onChange={handleChange}
        />
      </label>

      <label>
        Invoice Date:
        <input
          type="date"
          name="invoiceDate"
          value={formData.invoiceDate.split("T")[0]} // Formatting to date
          onChange={handleChange}
        />
      </label>

      <label>
        Invoice No:
        <input
          type="text"
          name="invoiceNo"
          value={formData.invoiceNo}
          onChange={handleChange}
        />
      </label>

      <label>
        Invoice Paid By:
        <input
          type="text"
          name="invoicePaidBy"
          value={formData.invoicePaidBy}
          onChange={handleChange}
        />
      </label>

      <label>
        Invoice Raised On:
        <input
          type="text"
          name="invoiceRaisedOn"
          value={formData.invoiceRaisedOn}
          onChange={handleChange}
        />
      </label>

      <label>
        Order Proforma No:
        <input
          type="text"
          name="orderProformaNo"
          value={formData.orderProformaNo}
          onChange={handleChange}
        />
      </label>

      {/* Repeat for the other fields, adjusting the field names and types as needed */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default YourFormComponent;
