import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/main.css";

const FetchDataForm = () => {
  // const url =
  // "https://booktrust-backend.onrender.com";
  const url = "http://localhost:8085";
  const [InputValues, setInputValues] = useState("");

  const [selectedQuery, setSelectedQuery] = useState("selectAll");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const [isOrderProformaChecked, setIsOrderProformaChecked] = useState(false);
  const [isCustomerIdChecked, setIsCustomerIdChecked] = useState(false);
  const [isInvoiceChecked, setIsInvoiceChecked] = useState(false);
  const [isPaypalInvoiceChecked, setIsPaypalInvoiceChecked] = useState(false);

  const [selectedFields, setSelectedFields] = useState({
    slNo: true,
    orderProformaNo: true,
    paypalInvoiceNo: true,
    paypalInvoiceDate: true,
    paypalInvoiceAmount: true,
    currencyType: true,
    paidByPaypal: false,
    exchangeRate: false,
    paypalTransactionId: true,
    bankRemittanceDate: true,
    bankRemittanceAmount: true,
    bankRemittanceNo: true,
    outOfRemittanceForOrder: false,
    firc: true,
    buyercustomerId: true,
    remittercustomerId: true,
    buyerDetails: false,
    remitterDetails: true,
    osrNo: false,
    osrDate: false,
    invoiceNo: true,
    invoiceDate: true,
    edpms: true,
    totalOrderValue: true,
    balanceAmount: true,
    awb: true,
    sb: true,
    sbd: true,
    sbAddress: true,
    sbSubmitted: false,
    sbFilingDate: false,
    sbRealisedDate: false,
    IRMfromBank: false,
    ebrc: false,

    ReasonforCancellation: true,
    isCancelled: true,
    amountPaid: true,
    OrderCreatedAt: false,
    OrderUpdatedAt: false,
  });

  // State for bankFields
  const [bankFields, setBankFields] = useState({
    shippingBillNo: true,
    shippingBillDate: true,
    portCode: true,
    overseasBuyer: true,
    invoiceNo: true,
    invoiceDate: true,
    invoiceAmount: true,
    awbBillOfLadingNo: true,
    dateOfRemittance: true,
    ModeOfRemmittance: true,
    amountInFC: true,
    amountInINR: true,
    remitterNameAndAddress: true,
    remitterCountry: true,
    paymentReferenceNo: true,
  });
  const columnOrder = [
    "SlNo",
    "OrderProformaNo",
    "ModeOfPayment",
    "PaypalInvoiceNo",
    "PaypalInvoiceDate",
    "PaypalInvoiceAmount",
    "PaidByPaypal",
    "CurrencyType",
    "ExchangeRate",
    "AmountPaid",

    "PaypalTransactionId",
    "BankRemittanceDate",
    "BankRemittanceAmount",
    "BankRemittanceNo",
    "OutOfRemittanceForOrder",
    "Firc",

    "BuyercustomerId",
    "BuyerDetails",
    "RemittercustomerId",
    "RemitterDetails",
    "OsrNo",
    "OsrDate",

    "InvoiceNo",
    "InvoiceDate",
    "TotalOrderValue",
    "Edpms",

    "Balance Amount",

    "Awb",
    "Sb",
    "Sbd",
    "SbAddress",
    "SbSubmitted",
    "SbFilingDate",
    "SbRealisedDate",
    "IRM from Bank",
    "Ebrc",

    "InvoiceAmount",
    "ShippingBillNo",
    "ShippingBillDate",
    "PortCode",
    "OverseasBuyer",

    "AwbBillOfLadingNo",
    "DateOfRemittance",
    "ModeOfRemmittance",
    "AmountInFC",
    "CurrencyType",
    "AmountInINR",

    "RemitterNameAndAddress",
    "RemitterCountry",
    "Payment Reference Number",
    "IsCancelled",
    "ReasonforCancellation",

    "OrderCreatedAt",
    "OrderUpdatedAt",
  ];

  const updateFields = (field, value) => {
    setSelectedFields((prevSelectedFields) => {
      // Update selectedFields without modifying bankFields
      return { ...prevSelectedFields, [field]: value };
    });
  };

  // Handle toggling of checkboxes for selectedFields
  const handleFieldChange = (e) => {
    const { name, checked } = e.target;
    updateFields(name, checked);
  };

  // Handle the change for master checkbox for selectedFields
  const handleSelectAllSelectedFields = (e) => {
    const isChecked = e.target.checked;
    setSelectedFields((prevFields) => {
      const updatedFields = {};
      for (const key in prevFields) {
        updatedFields[key] = isChecked;
      }
      return updatedFields;
    });
  };

  // Handle the change for master checkbox for bankFields
  const handleSelectAllBankFields = (e) => {
    const isChecked = e.target.checked;
    setBankFields((prevFields) => {
      const updatedFields = {};
      for (const key in prevFields) {
        updatedFields[key] = isChecked;
      }
      return updatedFields;
    });
  };

  function addIdentifiersToQuery({
    isOrderProformaChecked,

    isCustomerIdChecked,

    isInvoiceChecked,
    isPaypalInvoiceChecked,
  }) {
    const data = [];

    // Add orderProformaNo if checkbox is checked and it's a string
    if (
      isOrderProformaChecked &&
      InputValues &&
      typeof InputValues === "string"
    ) {
      data.push({
        identifier: "i1", // Identifier for orderProformaNo
        values: InputValues.split(","),
      });
    }

    // Add customerId if checkbox is checked and it's a string
    if (isCustomerIdChecked && InputValues && typeof InputValues === "string") {
      data.push({
        identifier: "i5", // Identifier for orderProformaNo
        values: InputValues.split(","),
      });
    }

    // Add InvoiceNo if checkbox is checked and it's a string
    if (isInvoiceChecked && InputValues && typeof InputValues === "string") {
      data.push({
        identifier: "i3", // Identifier for InvoiceNo
        values: InputValues.split(",").map((value) => value.trim()), // Split and trim values without parsing
      });
    }
    if (
      isPaypalInvoiceChecked &&
      InputValues &&
      typeof InputValues === "string"
    ) {
      data.push({
        identifier: "i4", // Identifier for InvoiceNo
        values: InputValues.split(",").map((value) => value.trim()), // Split and trim values without parsing
      });
    }
    return data;
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get identifiers by calling addIdentifiersToQuery
    const identifiers = addIdentifiersToQuery({
      isOrderProformaChecked,

      isCustomerIdChecked,

      isInvoiceChecked,
      isPaypalInvoiceChecked,
    });

    try {
      let data;

      // Handle different cases for selectedQuery
      switch (selectedQuery) {
        case "yearly":
          if (!year) {
            setError("Please select a year.");
            return;
          }
          data =
            identifiers.length === 0
              ? await fetchYearlyData(year)
              : await fetchSpecificYearlyData(year, identifiers);

          break;

        case "monthly":
          if (!month) {
            setError("Please select a year.");
            return;
          }
          data =
            identifiers.length === 0
              ? await fetchMonthlyData(month)
              : await fetchSpecificMonthlyData(month, identifiers);

          break;

        case "timeFrame":
          if (!startDate || !endDate) {
            setError("Please select a year.");
            return;
          }
          data =
            identifiers.length === 0
              ? await fetchTimeFrameData(startDate, endDate)
              : await fetchSpecificTimeFrameData(
                  startDate,
                  endDate,
                  identifiers
                );

          break;
        case "selectAll":
        default:
          data =
            identifiers.length === 0
              ? await fetchAllData()
              : await fetchAllData(identifiers);

          break;
      }

      // If data is successfully fetched, handle the download
      if (data && data.length > 0) {
        setError(""); // Clear any previous errors
        handleDownloadExcel(data); // Call your Excel download handler
      } else {
        setError("No data found");
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    }
  };

  // Backend function to handle the identifiers and apply filters
  const fetchAllData = async (identifiers) => {
    try {
      let response;

      if (identifiers && identifiers.length > 0) {
        const params = identifiers.reduce((acc, { identifier, values }) => {
          if (values && values.length > 0) {
            acc[identifier] = values.join(",");
          }

          return acc;
        }, {});
        // console.log(params);

        response = await axios.get(`${url}/api/fetchAllData`, {
          params,
        });
      } else {
        response = await axios.get(`${url}/api/fetchAllData`);
      }

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching all data:", error.response || error);
      throw new Error("Failed to fetch data");
    }
  };

  const fetchYearlyData = async (year) => {
    const response = await axios.get(`${url}/api/fetchYearlyData`, {
      params: { year },
    });
    return response.data.data || [];
  };

  const fetchSpecificYearlyData = async (year, identifiers) => {
    try {
      let response;

      const params = {
        year, // Add year to params
      };

      if (identifiers && identifiers.length > 0) {
        identifiers.forEach(({ identifier, values }) => {
          if (values && values.length > 0) {
            params[identifier] = values.join(","); // Add identifier values to params
          }
        });
      }

      // console.log(params);

      response = await axios.get(`${url}/api/fetchSpecificYearlyData`, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Error fetching specific yearly data:",
        error.response || error
      );
      throw new Error("Failed to fetch data");
    }
  };

  const fetchMonthlyData = async (month) => {
    const response = await axios.get(`${url}/api/fetchMonthlyData`, {
      params: { month },
    });
    return response.data.data || [];
  };

  const fetchSpecificMonthlyData = async (month, identifiers) => {
    try {
      const params = {
        month, // Add month to params
      };

      // Dynamically add identifiers to the params object
      if (identifiers && identifiers.length > 0) {
        identifiers.forEach(({ identifier, values }) => {
          if (values && values.length > 0) {
            params[identifier] = values.join(","); // Join values as comma-separated string
          }
        });
      }
      // console.log(params);

      const response = await axios.get(`${url}/api/fetchSpecificMonthlyData`, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Error fetching specific monthly data:",
        error.response || error
      );
      throw new Error("Failed to fetch data");
    }
  };

  const fetchTimeFrameData = async (startDate, endDate) => {
    // console.log(startDate, endDate);

    const response = await axios.get(`${url}/api/fetchTimeFrameData`, {
      params: { startDate, endDate },
    });
    return response.data.data || [];
  };

  const fetchSpecificTimeFrameData = async (
    startDate,
    endDate,
    identifiers
  ) => {
    try {
      const params = {
        startDate,
        endDate,
      };

      // Flatten identifiers into params
      if (identifiers && Array.isArray(identifiers)) {
        identifiers.forEach(({ identifier, values }) => {
          if (identifier && values && values.length > 0) {
            params[identifier] = values.join(","); // Flatten identifiers as comma-separated values
          }
        });
      }

      // console.log("Request params:", params);

      const response = await axios.get(
        `${url}/api/fetchSpecificTimeFrameData`,
        {
          params,
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Error fetching specific time frame data:",
        error.response || error
      );
      throw new Error("Failed to fetch data");
    }
  };

  const handleDownloadExcel = (data) => {
    // Ensure selectedFields is defined and has keys
    if (!selectedFields || typeof selectedFields !== "object") {
      console.error("selectedFields is not valid.", selectedFields);
      return;
    }

    // Filter selected fields where the checkbox is checked (true)
    const fields = [
      ...Object.keys(selectedFields).filter(
        (field) => selectedFields[field] === true
      ),
      ...Object.keys(bankFields).filter((field) => bankFields[field] === true),
    ];

    // Function to extract address fields and combine them into a string
    const getAddressFields = (address) => {
      if (address && typeof address === "object") {
        const {
          Name = "",
          address1 = "",
          address2 = "",
          city = "",
          state = "",
          country = "",
          zip = "",
          Phone = "",
          Email = "",
        } = address;
        return `Name: ${Name}, Address 1: ${address1}, Address 2: ${address2}, City: ${city}, State: ${state}, Country: ${country}, Zip: ${zip}, Phone: ${Phone}, Email: ${Email}`
          .trim()
          .replace(/(^,|,$)/g, "");
      }
      return "";
    };

    // Assign the value to the filteredItem with the capitalized field name

    // Create the filtered data for the Excel export
    const filteredData = data.map((item) => {
      let filteredItem = {};

      // Loop through the selected fields and include them if the checkbox is checked
      fields.forEach((field) => {
        // console.log(field);

        if (item[field] !== undefined) {
          if (field === "sbAddress") {
            filteredItem["SbAddress"] = getAddressFields(item[field]);
          } else if (field === "buyerDetails") {
            filteredItem["BuyerDetails"] = getAddressFields(item[field]);
          } else if (field === "remitterDetails") {
            filteredItem["RemitterDetails"] = getAddressFields(item[field]);
          } else if (field === "edpms") {
            filteredItem["Edpms"] = `₹ ${item[field]}`;
          } else if (field === "totalOrderValue") {
            filteredItem["TotalOrderValue"] = `₹ ${item[field]}`;
          } else if (field === "outOfRemittanceForOrder") {
            filteredItem["OutOfRemittanceForOrder"] = `₹ ${item[field]}`;
          } else if (field === "totalOrderValue") {
            filteredItem["TotalOrderValue"] = `₹ ${item[field]}`;
          } else if (field === "balanceAmount") {
            filteredItem["Balance Amount"] = `₹ ${item[field]}`;
          } else if (field === "edpms") {
            filteredItem[
              "EDPMS/ Bank Charges/ Other Expenses"
            ] = `₹ ${item[field]}`;
          } else {
            filteredItem[field.charAt(0).toUpperCase() + field.slice(1)] =
              item[field];
          }

          // Handle additional fields from bankFields
          if (bankFields.shippingBillNo && item["sb"]) {
            filteredItem["ShippingBillNo"] = item["sb"];
          }
          if (bankFields.shippingBillDate && item["sbd"]) {
            filteredItem["ShippingBillDate"] = item["sbd"];
          }
          if (bankFields.portCode) {
            filteredItem["PortCode"] = item["portCode"];
          }

          if (bankFields.invoiceNo) {
            filteredItem["InvoiceNo"] = item["invoiceNo"];
          }
          if (bankFields.invoiceDate) {
            filteredItem["InvoiceDate"] = new Date(item["invoiceDate"])
              .toISOString()
              .split("T")[0];
          }
          if (bankFields.invoiceAmount) {
            filteredItem["InvoiceAmount"] = item["totalOrderValue"];
          }
          if (bankFields.overseasBuyer) {
            filteredItem["OverseasBuyer"] = item["remitterDetails"]?.Name || "";
          }
          if (bankFields.remitterNameAndAddress) {
            filteredItem["RemitterNameAndAddress"] = getAddressFields(
              item["remitterDetails"] || ""
            );
          }
          if (bankFields.remitterCountry) {
            filteredItem["RemitterCountry"] =
              item["remitterDetails"]?.country || "";
          }
          if (bankFields.awbBillOfLadingNo) {
            filteredItem["AwbBillOfLadingNo"] = item["awb"];
          }
          if (bankFields.dateOfRemittance) {
            filteredItem["DateOfRemittance"] = new Date(
              item["bankRemittanceDate"]
            )
              .toISOString()
              .split("T")[0];
          }
          if (bankFields.ModeOfRemmittance) {
            filteredItem["ModeOfRemmittance"] = item["modeOfPayment"];
          }

          if (bankFields.modeOfPayment) {
            filteredItem["ModeOfPayment"] = item["modeOfPayment"];
          }

          if (bankFields.amountInFC) {
            if (item["modeOfPayment"] === "PAYPAL") {
              filteredItem[
                "AmountInFC"
              ] = `${item["paidByPaypal"]} ${item["currencyType"]}`;
              // filteredItem["CurrencyType"] = item["currencyType"];
            } else {
              filteredItem[
                "AmountInFC"
              ] = `${item["amountPaid"]} ${item["currencyType"]}`;
            }
          }
          if (bankFields.amountInINR) {
            if (item["modeOfPayment"] === "PAYPAL") {
              filteredItem[
                "AmountInINR"
              ] = `₹ ${item["outOfRemittanceForOrder"]}`;
            } else {
              filteredItem["AmountInINR"] = `₹ ${item["bankRemittanceAmount"]}`;
            }
          }

          if (bankFields.paymentReferenceNo) {
            filteredItem["Payment Reference Number"] = item["bankRemittanceNo"];
          }
        }
      });
      // console.log(filteredItem);

      return filteredItem;
    });
    // console.log(filteredData);
    const validKeys = new Set();
    filteredData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        validKeys.add(key);
      });
    });

    // Remove keys from columnOrder that are not in filteredData
    const updatedColumnOrder = columnOrder.filter((key) => validKeys.has(key));

    // Now map filteredData to reorderedData based on the updated columnOrder
    const reorderedData = filteredData.map((item) => {
      const reorderedItem = {};
      updatedColumnOrder.forEach((key) => {
        reorderedItem[key] = item[key] || ""; // Ensure missing keys are empty
      });
      return reorderedItem;
    });
    // const ws = XLSX.utils.json_to_sheet(reorderedData);
    // const wb = XLSX.utils.book_new();

    // // Set default column width
    // ws["!cols"] = Array(reorderedData.length).fill({ width: 20 }); // Adjust width as needed

    // XLSX.utils.book_append_sheet(wb, ws, "Fetched Data");

    // // Trigger Excel download
    // const filename = `fetched_data_${new Date().toISOString()}.xlsx`; // Dynamic filename with timestamp
    // XLSX.writeFile(wb, filename);

    const ws = XLSX.utils.json_to_sheet(reorderedData);
    const wb = XLSX.utils.book_new();

    // Set default column width
    ws["!cols"] = Array(reorderedData.length).fill({ width: 20 });

    // Check for rows where IsCancelled is true and apply "bad" style to the whole row
    reorderedData.forEach((row, rowIndex) => {
      if (row.IsCancelled === true) {
        const rowStart = rowIndex + 1; // Excel rows are 1-based index

        // Create a range for the entire row
        const range = XLSX.utils.decode_range(ws["!ref"]); // Get the existing range of the sheet

        // Apply the style for each cell in the row (from the first to the last column)
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowStart,
            c: colIndex,
          });

          // Ensure the cell has a style object
          if (!ws[cellAddress].s) {
            ws[cellAddress].s = {};
          }

          // Apply a minimal "bad" style: red text
          ws[cellAddress].s.font = {
            color: { rgb: "FF0000" }, // Red text to signify bad
          };
        }
      }
    });

    // Append the sheet and trigger the Excel download
    XLSX.utils.book_append_sheet(wb, ws, "Fetched Data");
    const filename = `fetched_data_${new Date().toISOString()}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  return (
    <div
      className="container my-5  width"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "15px",
        width: "1500px",
        marginLeft: "6%",
        padding: "40px",
      }}
    >
      <h2 className="text-center mb-5 ">Fetch Data</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="InputValues" className="form-label">
            Enter Values (comma-separated):
          </label>
          <input
            type="text"
            id="InputValues"
            className="form-control"
            value={InputValues}
            onChange={(e) => setInputValues(e.target.value)}
            placeholder="Enter multiple values separated by commas"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Identify Fields:</label>
          <div>
            <div className="form-check">
              <input
                type="radio"
                id="orderProforma"
                name="identifyField"
                className="form-check-input"
                checked={isOrderProformaChecked}
                onChange={() =>
                  setIsOrderProformaChecked(true) ||
                  setIsCustomerIdChecked(false) ||
                  setIsInvoiceChecked(false) ||
                  setIsPaypalInvoiceChecked(false)
                }
              />
              <label className="form-check-label" htmlFor="orderProforma">
                Order Proforma
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="customerId"
                name="identifyField"
                className="form-check-input"
                checked={isCustomerIdChecked}
                onChange={() =>
                  setIsCustomerIdChecked(true) ||
                  setIsOrderProformaChecked(false) ||
                  setIsInvoiceChecked(false) ||
                  setIsPaypalInvoiceChecked(false)
                }
              />
              <label className="form-check-label" htmlFor="customerId">
                Customer ID
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="InvoiceNo"
                name="identifyField"
                className="form-check-input"
                checked={isInvoiceChecked}
                onChange={() =>
                  setIsInvoiceChecked(true) ||
                  setIsOrderProformaChecked(false) ||
                  setIsCustomerIdChecked(false) ||
                  setIsPaypalInvoiceChecked(false)
                }
              />
              <label className="form-check-label" htmlFor="InvoiceNo">
                Invoice No
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="PayPalInvoiceNo"
                name="identifyField"
                className="form-check-input"
                checked={isPaypalInvoiceChecked}
                onChange={() =>
                  setIsPaypalInvoiceChecked(true) ||
                  setIsOrderProformaChecked(false) ||
                  setIsCustomerIdChecked(false) ||
                  setIsInvoiceChecked(false)
                }
              />
              <label className="form-check-label" htmlFor="PayPalInvoiceNo">
                Paypal Invoice No
              </label>
            </div>
          </div>
        </div>

        {/* <div className="mb-3">
          <label className="form-label">Identify Fields:</label>
          <div>
            <div className="form-check">
              <input
                type="checkbox"
                id="orderProforma"
                className="form-check-input"
                checked={isOrderProformaChecked}
                onChange={() =>
                  setIsOrderProformaChecked(!isOrderProformaChecked)
                }
              />
              <label className="form-check-label" htmlFor="orderProforma">
                Order Proforma
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="customerId"
                className="form-check-input"
                checked={isCustomerIdChecked}
                onChange={() => setIsCustomerIdChecked(!isCustomerIdChecked)}
              />
              <label className="form-check-label" htmlFor="customerId">
                Customer ID
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="InvoiceNo"
                className="form-check-input"
                checked={isInvoiceChecked}
                onChange={() => setIsInvoiceChecked(!isInvoiceChecked)}
              />
              <label className="form-check-label" htmlFor="InvoiceNo">
                Invoice No
              </label>
            </div>{" "}
            <div className="form-check">
              <input
                type="checkbox"
                id="PayPalInvoiceNo"
                className="form-check-input"
                checked={isPaypalInvoiceChecked}
                onChange={() =>
                  setIsPaypalInvoiceChecked(!isPaypalInvoiceChecked)
                }
              />
              <label className="form-check-label" htmlFor="PayPalInvoiceNo">
                Paypal Invoice No
              </label>
            </div>
          </div>
        </div> */}

        <div className="mb-3">
          <label htmlFor="querySelect" className="form-label">
            Select Query Type:
          </label>
          <select
            id="querySelect"
            className="form-select"
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
          >
            <option value="selectAll">Select All</option>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="timeFrame">Time Frame</option>
          </select>
        </div>

        {selectedQuery === "yearly" && (
          <div className="mb-3">
            <label htmlFor="year" className="form-label">
              Year:
            </label>
            <input
              type="number"
              id="year"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max="9999"
              placeholder="Enter year"
            />
          </div>
        )}

        {selectedQuery === "monthly" && (
          <div className="mb-3">
            <label htmlFor="month" className="form-label">
              Month:
            </label>
            <input
              type="month"
              id="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        )}

        {selectedQuery === "timeFrame" && (
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        )}

        {selectedQuery === "timeFrame" && (
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <div className="form-check mb-2">
            <input
              type="checkbox"
              checked={Object.values(selectedFields).every(
                (value) => value === true
              )}
              onChange={handleSelectAllSelectedFields}
              className="form-check-input"
              id="selectAllSelectedFields"
            />
            <label
              className="form-check-label"
              htmlFor="selectAllSelectedFields"
            >
              Select All Selected Fields
            </label>
          </div>

          {/* Render checkboxes for selectedFields */}
          <div className="row">
            {Object.keys(selectedFields).map((field) => (
              <div key={field} className="col-sm-4 mb-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={selectedFields[field]}
                    className="form-check-input"
                    onChange={handleFieldChange}
                    name={field}
                    id={field}
                  />
                  <label className="form-check-label" htmlFor={field}>
                    {field}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master checkbox for bankFields */}
        <div className="mb-4">
          <div className="form-check mb-2">
            <input
              type="checkbox"
              checked={Object.values(bankFields).every(
                (value) => value === true
              )}
              className="form-check-input"
              id="selectAllBankFields"
              onChange={handleSelectAllBankFields}
            />
            <label className="form-check-label" htmlFor="selectAllBankFields">
              Select All Bank Fields
            </label>
          </div>

          {/* Render checkboxes for bankFields */}
          <div className="row">
            {Object.keys(bankFields).map((field) => (
              <div key={field} className="col-sm-4 mb-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={bankFields[field]}
                    className="form-check-input"
                    onChange={() =>
                      setBankFields((prevFields) => ({
                        ...prevFields,
                        [field]: !prevFields[field],
                      }))
                    }
                    id={field}
                  />
                  <label className="form-check-label" htmlFor={field}>
                    {field}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-success gap-2">
          Download Excel
        </button>
      </form>
    </div>
  );
};

export default FetchDataForm;
