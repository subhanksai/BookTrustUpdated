const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderProformaNo: { type: String, required: true },
    modeOfPayment: {
      type: String,
    },
    amountPaid: {
      type: Number,
    },
    paypalInvoiceNo: {
      type: String,
    },
    paypalInvoiceDate: {
      type: Date,
    },
    paypalInvoiceAmount: {
      type: Number,
    },
    currencyType: {
      type: String,
    },
    paidByPaypal: {
      type: Number,
    },
    exchangeRate: {
      type: Number,
    },
    paypalTransactionId: {
      type: String,
    },
    bankRemittanceDate: {
      type: Date,
    },
    bankRemittanceAmount: {
      type: Number,
    },
    bankRemittanceNo: {
      type: String,
    },
    outOfRemittanceForOrder: {
      type: Number,
    },
    firc: {
      type: String,
    },

    buyercustomerId: { type: String },
    buyerDetails: {
      Name: { type: String },

      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: String },
      Phone: { type: String },
      Email: { type: String },
    },
    remittercustomerId: { type: String },
    remitterDetails: {
      Name: { type: String },

      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: String },
      Phone: { type: String },
      Email: { type: String },
    },
    osrNo: {
      type: String,
    },
    osrDate: {
      type: Date,
    },
    invoiceNo: {
      type: String,
    },
    invoiceDate: {
      type: Date,
    },
    edpms: {
      type: Number,
    },
    totalOrderValue: {
      type: Number,
    },
    balanceAmount: {
      type: Number,
    },
    awb: {
      type: String,
    },
    sb: {
      type: String,
    },
    sbd: {
      type: Date,
    },

    sbAddress: {
      Name: { type: String },

      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: String },
      Phone: { type: String },
      Email: { type: String },
    },
    sbSubmitted: {
      type: String,
    },
    sbFilingDate: {
      type: Date,
    },
    sbRealisedDate: {
      type: Date,
    },
    IRMfromBank: {
      type: String,
    },
    ebrc: {
      type: String,
    },
    yesNoOption: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    portCode: {
      type: String,
    },
    ReasonforCancellation: {
      type: String,
    },
    isCancelled: {
      type: Boolean,
    },
    OrderCreatedAt: {
      type: Date,
    },
    OrderUpdatedAt: {
      type: Date,
    },
  },

  {
    timestamps: false, // Disable default timestamps (createdAt and updatedAt)
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
