import React from "react";
import { useState } from "react";
import axios from "axios";
import "../CSS/main.css";

const BalancePage = () => {
  const url = "http://localhost:8085";
  // const url =
  //   "https://booktrust-backend.onrender.com";
  const [formData, setFormData] = useState({
    remitterCountry: "",
    paymentReferenceNo: "",
    orderProformaNo: "",
    amountPaid: "",
    paypalInvoiceNo: "",
    paypalInvoiceDate: "",
    paypalInvoiceAmount: "",
    currencyType: "",
    paidByPaypal: "",
    exchangeRate: "",
    paypalTransactionId: "",
    bankRemittanceDate: "",
    bankRemittanceAmount: "",
    bankRemittanceNo: "",
    outOfRemittanceForOrder: "",
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
    edpms: "",
    totalOrderValue: "",
    balanceAmount: "",
    awb: "",
    sb: "",
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
    ebrc: "",
    yesNoOption: "no",
    portCode: "",
    modeOfPayment: "",
  });
  const [error, setError] = useState("");

  const [isCustomerIdChecked, setIsCustomerIdChecked] = useState(false);
  const [InputValues, setInputValues] = useState("");

  //Identifier

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Prepare the params object dynamically
      const params = {};

      if (InputValues && typeof InputValues === "string") {
        params["i2"] = InputValues.split(",")
          .map((value) => value.trim())
          .join(",");
      }

      console.log("Request Params:", params);

      // Send API request with the constructed params
      const response = await axios.get(`${url}/api/getOrder`, {
        params,
      });

      // Ensure response.data.orders exists and is an array before accessing
      if (
        response.data &&
        Array.isArray(response.data.orders) &&
        response.data.orders.length > 0
      ) {
        setFormData(response.data.orders[0]); // Set the first order from the response
        setError(""); // Clear any previous errors
      } else {
        setError("Customer not found"); // If no orders are found, display the error
      }
    } catch (err) {
      console.error("Error fetching order data:", err);
      setError("Error fetching order data"); // Handle API or network errors
    }
  };
  return (
    <>
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
        <h2 className="text-center mb-4">Check Balance</h2>
        <form onSubmit={handleSearch}>
          <div className="mb-3">
            <label htmlFor="InputValues" className="form-label">
              Enter Remitter Customer Id:
            </label>
            <input
              type="text"
              id="InputValues"
              className="form-control"
              value={InputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="Remitter Customer ID"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}

        {formData.balanceAmount !== null && (
          <div className="mt-4">
            <h4 className="text-success" style={{ fontWeight: "bold" }}>
              Balance Amount: {formData.balanceAmount}
            </h4>{" "}
            <h4 className="text" style={{ fontWeight: "bold" }}>
              Till:{" "}
              {formData.OrderUpdatedAt
                ? formData.OrderUpdatedAt.split("T")[0]
                : ""}{" "}
              Time:{" "}
              {formData.OrderUpdatedAt
                ? formData.OrderUpdatedAt.split("T")[1].split(".")[0]
                : ""}
            </h4>
          </div>
        )}
      </div>
    </>
  );
};

export default BalancePage;
