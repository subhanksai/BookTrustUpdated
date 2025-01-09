import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

// import { useFormData } from "./FormDataContext";

const OrderForm = () => {
  const [errors, setErrors] = useState({});
  const url = "http://localhost:8085";
  // const url = "https://booktrust-backend.onrender.com";

  // const { formData, setFormData } = useFormData();
  const [formData, setFormData] = useState({
    slNo: "",
    orderProformaNo: "",
    paypalInvoiceNo: "",
    paypalInvoiceDate: "",
    paypalInvoiceAmount: "",
    currencyType: "",
    amountPaid: "",
    paypalTransactionId: "",
    bankRemittanceDate: "",
    bankRemittanceAmount: "",
    bankRemittanceNo: "",
    paidByPaypal: 0,
    exchangeRate: 0,
    outOfRemittanceForOrder: 0,
    firc: "",
    buyercustomerId: "",
    buyerDetails: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      Phone: "",
      Email: "",
    },
    remittercustomerId: "",
    remitterDetails: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      Phone: "",
      Email: "",
    },
    osrNo: "",
    osrDate: "",
    invoiceNo: "",
    invoiceDate: "",
    edpms: "",
    totalOrderValue: "",
    balanceAmount: "",
    awb: "",
    sbd: "",

    sbAddress: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    sbSubmitted: "",
    sbFilingDate: "",
    sbRealisedDate: "",
    IRMfromBank: "",
    ebrc: "",
    yesNoOption: "no",
    portCode: "",
    modeOfPayment: "",

    isSameAsBuyer: false,
    OrderCreatedAt: "",
    OrderUpdatedAt: "",
  });
  // Initialize state outside the event handler
  const [prevBalance, setPrevBalance] = useState(0); // Initialize with 0
  const [curBalance, setCurBalance] = useState(0); // Assuming you need curBalance as well

  function calculateOutOfRemittance(paidByPaypal, exchangeRate) {
    if (paidByPaypal && exchangeRate) {
      console.log(exchangeRate);

      const updatedOutOfRemittance = paidByPaypal * exchangeRate;
      console.log(parseFloat(updatedOutOfRemittance.toFixed(2)));

      return parseFloat(updatedOutOfRemittance.toFixed(2)); // Ensures a float with 2 decimal precision
    }
    return 0.0; // Return 0.0 as a float
  }

  function calculateRemainingBalanceForNew(val1, val2, total) {
    console.log("Inputs:", val1, val2, total);

    // Parse values as numbers (fallback to 0 if NaN)
    const edpmsAmount = parseFloat(val1) || 0;
    const totalOrderValue = parseFloat(val2) || 0;
    const currentBalance = parseFloat(total) || 0;

    const remaining = currentBalance - edpmsAmount - totalOrderValue;

    console.log("Remaining Balance:", remaining);

    return remaining.toFixed(2);
  }

  // Hook to handle changes in form inputs dynamically
  const handleCalChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedValue = parseFloat(value) || 0;
      const updatedData = {
        ...prevData,
        [name]: updatedValue, // Dynamically update the field
      };

      // console.log("Updated Form Data:", updatedData);
      console.log("Here", prevBalance);

      // Start with the current balance (updated dynamically)
      let updatedBalance = prevBalance;

      // Calculate the remaining balance using updated values
      const edpmsAmount = parseFloat(updatedData.edpms) || 0;
      const totalOrderValue = parseFloat(updatedData.totalOrderValue) || 0;

      // Calculate the remaining balance
      updatedBalance = calculateRemainingBalanceForNew(
        edpmsAmount,
        totalOrderValue,
        updatedBalance // Use dynamically adjusted balance
      );

      // Update the form state with recalculated balance
      updatedData.balanceAmount = parseFloat(updatedBalance);
      setCurBalance(parseFloat(updatedBalance));
      return updatedData;
    });
  };
  // console.log("CUR", curBalance);
  // console.log("Prev", prevBalance);

  // Use the context values
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => {
      if (isChecked) {
        // If checked, copy all relevant fields from buyerDetails to remitterDetails
        return {
          ...prevState,
          remitterDetails: {
            ...prevState.buyerDetails, // Copy everything from buyerDetails to remitterDetails
            remitterAddress: { ...prevState.buyerDetails.buyerAddress }, // Copy address as well
          },
          isSameAsBuyer: true,
        };
      } else {
        // If unchecked, reset both personal and address fields for remitterDetails
        return {
          ...prevState,
          remitterDetails: {
            Name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            Phone: "",
            Email: "",
          },
          isSameAsBuyer: false,
        };
      }
    });
  };
  const handleSBAddressCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => {
      if (isChecked) {
        // Copy remitterDetails to sbAddress
        return {
          ...prevState,
          sbAddress: { ...prevState.remitterDetails },
          isSBAddressSameAsRemitter: true,
        };
      } else {
        // Reset sbAddress fields
        return {
          ...prevState,
          sbAddress: {
            Name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            Phone: "",
            Email: "",
          },
          isSBAddressSameAsRemitter: false,
        };
      }
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const idParts = id.split(".");

    setFormData((prevState) => {
      let updatedState = { ...prevState };
      let nestedObject = updatedState;

      // Traverse through the object based on the parts of the ID
      idParts.forEach((part, index) => {
        if (index === idParts.length - 1) {
          nestedObject[part] = value; // Assign the value to the last part
        } else {
          nestedObject = nestedObject[part];
        }
      });

      return updatedState;
    });
  };

  const handleChangeSelection = (e) => {
    const { name, value } = e.target;

    // Split the 'name' into an array to handle nested objects
    const keys = name.split(".");

    setFormData((prevState) => {
      // Create a copy of the previous state
      const newFormData = { ...prevState };

      let currentObj = newFormData;

      // Traverse through the keys and update the nested value
      for (let i = 0; i < keys.length - 1; i++) {
        // Check if the key exists and is an object
        if (!currentObj[keys[i]]) {
          currentObj[keys[i]] = {}; // Create the nested object if it doesn't exist
        }
        currentObj = currentObj[keys[i]];
      }

      // Set the value to the final key
      currentObj[keys[keys.length - 1]] = value;

      return newFormData;
    });
  };

  const handleRadioChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      yesNoOption: event.target.value,
    }));
  };

  // const handleBalanceCheck = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };
  const [customerFound, setCustomerFound] = useState(null);

  const updateExchange = async (e) => {
    const { id, value } = e.target;
    e.preventDefault();

    setFormData((prevState) => {
      const updatedState = { ...prevState, [id]: value }; // Update the specific field dynamically

      if (updatedState.modeOfPayment === "PAYPAL") {
        console.log("here");

        const updatedOutOfRemittance = calculateOutOfRemittance(
          updatedState.paidByPaypal,
          updatedState.exchangeRate
        );

        // Set the updated outOfRemittanceForOrder in formData
        updatedState.outOfRemittanceForOrder = updatedOutOfRemittance;
        setPrevBalance(updatedOutOfRemittance);
        setCurBalance(updatedOutOfRemittance);
      } else {
        const updatedBalance =
          parseFloat(updatedState.bankRemittanceAmount) || 0;

        setPrevBalance(updatedBalance);
        setCurBalance(updatedBalance);
      }

      return updatedState;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};

    if (
      formData.remittercustomerId &&
      typeof formData.remittercustomerId === "string"
    ) {
      params["i2"] = formData.remittercustomerId
        .split(",")
        .map((value) => value.trim())
        .join(",");
    }
    //
    try {
      const response = await axios.get(`${url}/api/getOrder`, { params });
      console.log("API Response:", response.data);

      const existingOrder = response.data.orders?.[0];
      if (existingOrder) {
        setCustomerFound(true);
        let updatedBalance = parseFloat(existingOrder.balanceAmount) || 0;

        if (formData.modeOfPayment === "PAYPAL") {
          updatedBalance += parseFloat(formData.outOfRemittanceForOrder) || 0;
        } else {
          updatedBalance += parseFloat(formData.bankRemittanceAmount) || 0;
        }

        setPrevBalance(updatedBalance);
        setCurBalance(updatedBalance);
      } else {
        setCustomerFound(false);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const getISTTime = () => {
      const istOffset = 5.5 * 60 * 60000; // 5 hours 30 minutes in milliseconds
      return new Date(Date.now() + istOffset).toISOString();
    };
    const safeNumber = (value, defaultValue = 0) => {
      const num = parseFloat(value);
      return isNaN(num) ? defaultValue : num;
    };

    try {
      // Use safeNumber for balanceAmount
      const numericBalanceAmount = safeNumber(balanceAmount);

      // Prepare remittance field based on modeOfPayment
      let remittanceField = {};
      if (formData.modeOfPayment === "PAYPAL") {
        remittanceField.outOfRemittanceForOrder = safeNumber(
          outOfRemittanceForOrder
        ).toFixed(2);
      } else {
        remittanceField.bankRemittanceAmount =
          safeNumber(bankRemittanceAmount).toFixed(2);
      }

      // Construct the new record
      const newRecord = {
        ...formData,
        balanceAmount: numericBalanceAmount.toFixed(2),
        ...remittanceField, // Add the conditional remittance field
        OrderCreatedAt: getISTTime(),
        OrderUpdatedAt: getISTTime(),
      };

      console.log("New Record (Creating new order):", newRecord);

      // Make the API call
      const postResponse = await axios.post(`${url}/api/create`, newRecord);
      console.log("Record created successfully:", postResponse.data);
      alert("Record created successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error during API call:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="container my-5  width "
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "15px",
        width: "1500px",
        marginLeft: "6%",
        padding: "40px",
      }}
    >
      <h2 className="text-center mb-5">Order Form</h2>
      <form
        className="row g-3 bg-light p-4 rounded shadow"
        onSubmit={handleSubmit}
      >
        {/* Row 1 */}
        <div className="col-md-1">
          <label htmlFor="slNo" className="form-label">
            SL.NO.
          </label>
          <input
            type="text"
            className="form-control"
            id="slNo"
            value={formData.slNo}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="orderProformaNo" className="form-label">
            Order Proforma No.
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.orderProformaNo ? "is-invalid" : ""
            }`}
            id="orderProformaNo"
            value={formData.orderProformaNo}
            onChange={handleChange}
          />
          {errors.orderProformaNo && (
            <div className="invalid-feedback">{errors.orderProformaNo}</div>
          )}
        </div>
        {/* Mode of Remittance */}
        <div className="col-md-4">
          <label className="form-label">Mode of Payment</label>
          <select
            className="form-control"
            name="modeOfPayment"
            value={formData.modeOfPayment}
            onChange={handleChangeSelection}
          >
            <option value="">Select Mode</option> {/* Default empty option */}
            <option value="PAYPAL">PAYPAL</option>
            <option value="SWIFT">SWIFT</option>
            <option value="NRE">NRE</option>
            <option value="FOREIGN BRANCH">FOREIGN BRANCH</option>
          </select>
        </div>
        {formData.modeOfPayment === "SWIFT" && (
          <>
            <div className="col-md-3">
              <label htmlFor="amountPaid" className="form-label">
                Amount Paid
              </label>
              <input
                type="text"
                className="form-control"
                id="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1">
              <label htmlFor="currencyType" className="form-label">
                Currency
              </label>
              <input
                type="text"
                placeholder="USD, EU"
                className="form-control"
                id="currencyType"
                value={formData.currencyType}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {/* Render PayPal fields conditionally */}
        {formData.modeOfPayment === "PAYPAL" && (
          <>
            <div className="col-md-4">
              <label htmlFor="paypalInvoiceNo" className="form-label">
                PayPal Invoice No.
              </label>
              <input
                type="text"
                className="form-control"
                id="paypalInvoiceNo"
                value={formData.paypalInvoiceNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="paypalInvoiceDate" className="form-label">
                PayPal Invoice Date
              </label>
              <input
                type="date"
                className="form-control"
                id="paypalInvoiceDate"
                value={formData.paypalInvoiceDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="paypalInvoiceAmount" className="form-label">
                PayPal Invoice Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="paypalInvoiceAmount"
                value={formData.paypalInvoiceAmount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1">
              <label htmlFor="currencyType" className="form-label">
                Currency
              </label>
              <input
                type="text"
                placeholder="USD, EU"
                className="form-control"
                id="currencyType"
                value={formData.currencyType}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="paidByPaypal" className="form-label">
                Paid by PayPal
              </label>
              <input
                type="text"
                className="form-control"
                id="paidByPaypal"
                value={formData.paidByPaypal}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="exchangeRate" className="form-label">
                Exchange Rate
              </label>
              <input
                type="text"
                className="form-control"
                id="exchangeRate"
                value={formData.exchangeRate}
                onChange={updateExchange}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="paypalTransactionId" className="form-label">
                PayPal Transaction ID
              </label>
              <input
                type="text"
                className="form-control"
                id="paypalTransactionId"
                value={formData.paypalTransactionId}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="col-md-3 ">
          <label htmlFor="bankRemittanceDate" className="form-label">
            Bank Remittance Date
          </label>
          <input
            type="date"
            className="form-control"
            id="bankRemittanceDate"
            value={formData.bankRemittanceDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="bankRemittanceAmount" className="form-label">
            Bank Remittance Amount (INR)
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="INR"
            id="bankRemittanceAmount"
            value={formData.bankRemittanceAmount}
            onChange={updateExchange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="bankRemittanceNo" className="form-label">
            Bank Remittance No.
          </label>
          <input
            type="text"
            className="form-control"
            id="bankRemittanceNo"
            value={formData.bankRemittanceNo}
            onChange={handleChange}
          />
        </div>
        {formData.modeOfPayment === "PAYPAL" && (
          <>
            {" "}
            <div className="col-md-4">
              <label htmlFor="outOfRemittanceForOrder" className="form-label">
                Out of Remittance for Order (INR)
              </label>
              <div
                id="outOfRemittanceForOrder"
                className="form-control bg-light"
                style={{
                  border: "1px solid #ced4da",
                  padding: "0.375rem 0.75rem",
                }}
              >
                {/* Display the dynamically updated value of outOfRemittanceForOrder */}
                {formData.outOfRemittanceForOrder}
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="firc" className="form-label">
                FIRC
              </label>
              <input
                type="text"
                className="form-control"
                id="firc"
                value={formData.firc}
                onChange={handleChange}
              />
            </div>{" "}
          </>
        )}
        <div></div>
        {/* Additional Fields */}
        <div>
          <h4 className="mt-3">Buyer Details</h4>
          <div className="row">
            {/* Buyer Customer ID */}
            <div className="col-md-2">
              <label htmlFor="buyercustomerId" className="form-label">
                Buyer Customer ID
              </label>
              <input
                type="text"
                className="form-control"
                id="buyercustomerId"
                value={formData.buyercustomerId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Buyer Address Section */}
          <div className="address-section mt-2 mb-5">
            <div className="row">
              {/* Buyer Name */}
              <div className="col-md-4 mb-2">
                <label htmlFor="buyerDetails.Name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.Name"
                  value={formData.buyerDetails.Name}
                  onChange={handleChange}
                />
              </div>
              <div></div>
              {/* Address 1 */}
              <div className="col-md-6">
                <label htmlFor="buyerDetails.address1" className="form-label">
                  Address 1
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.address1"
                  value={formData.buyerDetails.address1}
                  onChange={handleChange}
                />
              </div>

              {/* Address 2 */}
              <div className="col-md-6 mb-3">
                <label htmlFor="buyerDetails.address2" className="form-label">
                  Address 2
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.address2"
                  value={formData.buyerDetails.address2}
                  onChange={handleChange}
                />
              </div>

              {/* City */}
              <div className="col-md-4">
                <label htmlFor="buyerDetails.city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.city"
                  value={formData.buyerDetails.city}
                  onChange={handleChange}
                />
              </div>

              {/* State */}
              <div className="col-md-4">
                <label htmlFor="buyerDetails.state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.state"
                  value={formData.buyerDetails.state}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="buyerDetails.country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.country"
                  value={formData.buyerDetails.country}
                  onChange={handleChange}
                />
              </div>

              {/* ZIP Code */}
              <div className="col-md-4 mt-2">
                <label htmlFor="buyerDetails.zip" className="form-label">
                  ZIP Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.zip"
                  value={formData.buyerDetails.zip}
                  onChange={handleChange}
                />
              </div>
              {/* Buyer Phone */}
              <div className="col-md-3 mt-2">
                <label htmlFor="buyerDetails.Phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.Phone"
                  value={formData.buyerDetails.Phone}
                  onChange={handleChange}
                />
              </div>

              {/* Buyer Email */}
              <div className="col-md-4 mt-2">
                <label htmlFor="buyerDetails.Email" className="form-label">
                  Email (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerDetails.Email"
                  value={formData.buyerDetails.Email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Checkbox to copy Buyer Address to Remitter Address */}
        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameAddress"
            checked={formData.isSameAsBuyer}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="sameAddress">
            Remitter Address is the same as Buyer Address
          </label>
        </div>
        {/* Remitter Details*/}
        <div>
          <h4 className="mb-3 mt-3">Remitter Details</h4>
          <div>
            <div className="col-md-2">
              <label htmlFor="remittercustomerId" className="form-label">
                Remitter Customer ID
              </label>
              <input
                type="text"
                className="form-control"
                id="remittercustomerId"
                value={formData.remittercustomerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remittercustomerId: e.target.value,
                  })
                }
              />
            </div>
            <div
              className={`btn btn-primary mt-3 ${
                !formData.remittercustomerId ? "disabled" : ""
              }`}
              onClick={formData.remittercustomerId ? handleSearch : null} // Only trigger if input is not empty
              style={{
                cursor: formData.remittercustomerId ? "pointer" : "not-allowed",
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: formData.remittercustomerId
                  ? "#007bff"
                  : "#6c757d",
                color: "#fff",
                borderRadius: "5px",
              }}
            >
              Search
            </div>
            {/* Display customer status below button */}
            {customerFound === true && (
              <p style={{ color: "green" }}>Customer ID found!</p>
            )}
            {customerFound === false && (
              <p style={{ color: "red" }}>Customer ID not found.</p>
            )}
          </div>

          {/* Remitter Address Section */}
          <div className="address-section mt-3 mb-5">
            <div className="col-md-4">
              <label htmlFor="remitterDetails.Name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="remitterDetails.Name"
                value={formData.remitterDetails.Name}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <label
                  htmlFor="remitterDetails.address1"
                  className="form-label"
                >
                  Address 1
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.address1"
                  value={formData.remitterDetails.address1}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="remitterDetails.address2"
                  className="form-label"
                >
                  Address 2
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.address2"
                  value={formData.remitterDetails.address2}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="remitterDetails.city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.city"
                  value={formData.remitterDetails.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="remitterDetails.state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.state"
                  value={formData.remitterDetails.state}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="remitterDetails.country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.country"
                  value={formData.remitterDetails.country}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mt-2">
                <label htmlFor="remitterDetails.zip" className="form-label">
                  ZIP Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.zip"
                  value={formData.remitterDetails.zip}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mt-2">
                <label htmlFor="remitterDetails.Phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.Phone"
                  value={formData.remitterDetails.Phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mt-2">
                <label htmlFor="remitterDetails.Email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.Email"
                  value={formData.remitterDetails.Email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <label htmlFor="osrNo" className="form-label">
            OSR Number
          </label>
          <input
            type="text"
            className="form-control"
            id="osrNo"
            value={formData.osrNo}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="osrDate" className="form-label">
            OSR Date
          </label>
          <input
            type="date"
            className="form-control"
            id="osrDate"
            value={formData.osrDate}
            onChange={handleChange}
          />
        </div>
        <div></div>
        <div className="col-md-4">
          <label htmlFor="invoiceNo" className="form-label">
            Invoice Number
          </label>
          <input
            type="text"
            className="form-control"
            id="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="invoiceDate" className="form-label">
            Invoice Date
          </label>
          <input
            type="date"
            className="form-control"
            id="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
          />
        </div>
        <div></div>
        <div className="row">
          <div className="col-md-4 col-sm-6 col-12">
            <label htmlFor="edpms" className="form-label">
              EDPMS/ Bank Charges/ Other Expenses
            </label>
            <input
              type="text"
              className="form-control"
              id="edpms"
              name="edpms"
              value={formData.edpms}
              onChange={handleCalChange}
              placeholder="Enter EDPMS or Expenses"
            />
          </div>

          <div className="col-md-4 col-sm-6 col-12">
            <label htmlFor="totalOrderValue" className="form-label">
              Total Order Value
            </label>
            <input
              type="text"
              name="totalOrderValue"
              className="form-control"
              id="totalOrderValue"
              value={formData.totalOrderValue}
              onChange={handleCalChange}
              placeholder="Enter Total Order Value"
            />
          </div>

          <div className="col-md-2 col-sm-6 col-12">
            <label htmlFor="balanceAmount" className="form-label">
              Balance Amount
            </label>
            <input
              type="text"
              name="balanceAmount"
              className="form-control"
              id="balanceAmount"
              value={curBalance}
              disabled={true}
            />
          </div>
        </div>
        <div>
          {/* Your component's UI */}
          <div className="col-md-4 custom-label text-with-border">
            <h4
              htmlFor="balanceAmount"
              className={`fontkind ${
                curBalance > 0 ? "text-success" : "text-danger"
              }`}
            >
              Balance Amount:&nbsp; &nbsp;
              {curBalance !== undefined ? curBalance : "N/A"}
            </h4>
          </div>
          {/* More UI elements */}
        </div>

        <div className="col-md-2">
          <label htmlFor="awb" className="form-label">
            AWB
          </label>
          <input
            type="text"
            className="form-control"
            id="awb"
            value={formData.awb}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="sb" className="form-label">
            Shipping Bill
          </label>
          <input
            type="String"
            className="form-control"
            id="sb"
            value={formData.sb}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="sbd" className="form-label">
            Shipping Bill Date
          </label>
          <input
            type="date"
            className="form-control"
            id="sbd"
            value={formData.sbd}
            onChange={handleChange}
          />
        </div>
        <div></div>
        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameSBAddress"
            checked={formData.isSBAddressSameAsRemitter}
            onChange={handleSBAddressCheckboxChange}
          />
          <label className="form-check-label" htmlFor="sameSBAddress">
            SB Address is the same as Remitter Address
          </label>
        </div>
        <div className="address-section">
          <h4>Shipping Bill Address</h4>
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="sbAddress.Name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.Name"
                value={formData.sbAddress.Name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="sbAddress.address1" className="form-label">
                Address 1
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.address1"
                value={formData.sbAddress.address1}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="sbAddress.address2" className="form-label">
                Address 2
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.address2"
                value={formData.sbAddress.address2}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.city"
                value={formData.sbAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.state" className="form-label">
                State
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.state"
                value={formData.sbAddress.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.country" className="form-label">
                Country
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.country"
                value={formData.sbAddress.country}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.zip" className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.zip"
                value={formData.sbAddress.zip}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Port Code */}
        <div className="col-md-4">
          <label className="form-label">Port Code</label>

          <select
            className="form-control"
            name="portCode"
            value={formData.portCode}
            onChange={handleChangeSelection}
          >
            <option value="">Select Mode</option> {/* Default empty option */}
            <option value="INBLR4">INBLR4</option>
            <option value="INMAA1">INMAA1</option>
          </select>
        </div>
        {/* Yes/No Radio Buttons */}
        <div className="col-md-4">
          <label className="form-label">
            Is the information submitted to bank?
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="yesNoOption"
              id="yesOption"
              value="yes"
              checked={formData.yesNoOption === "yes"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="yesOption">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="yesNoOption"
              id="noOption"
              value="no"
              checked={formData.yesNoOption === "no"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="noOption">
              No
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <label htmlFor="sbFilingDate" className="form-label">
            SB Filing Date
          </label>
          <input
            type="date"
            className="form-control"
            id="sbFilingDate"
            value={formData.sbFilingDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="sbRealisedDate" className="form-label">
            SB RealisedDate
          </label>
          <input
            type="date"
            className="form-control"
            id="sbRealisedDate"
            value={formData.sbRealisedDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="IRMfromBank" className="form-label">
            IRM from Bank
          </label>
          <input
            type="text"
            className="form-control"
            id="IRMfromBank"
            value={formData.IRMfromBank}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="ebrc" className="form-label">
            eBRC
          </label>
          <input
            type="text"
            className="form-control"
            id="ebrc"
            value={formData.ebrc}
            onChange={handleChange}
          />
        </div>
        {/* Submit Button */}
        <div className="col-12 text-center mt-5 mb-5 d-grid gap-2">
          <button type="submit" className="btn btn-success px-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
