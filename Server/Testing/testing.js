const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Order = require("../Mongo/FormDataSchema");

const url =
  "mongodb://127.0.0.1:27017/BookTrust?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.4";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
    generateFakeOrders();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const generateFakeOrder = async () => {
  return {
    slNo: faker.number.int(),
    orderProformaNo: faker.string.alphanumeric(10),
    modeOfPayment: faker.helpers.arrayElement([
      "PAYPAL",
      "SWIFT",
      "NRE",
      "FOREIGN BRANCH",
    ]),
    paypalInvoiceNo: faker.string.uuid(),
    paypalInvoiceDate: faker.date.past({ years: 6 }),
    paypalInvoiceAmount: faker.commerce.price(),
    currencyType: faker.finance.currencyCode(),
    amountPaid: faker.commerce.price(),
    paidByPaypal: faker.number.int(),
    exchangeRate: faker.number.float({ min: 1, max: 100 }),
    paypalTransactionId: faker.string.uuid(),
    bankRemittanceDate: faker.date.past(),
    bankRemittanceAmount: faker.commerce.price(),
    bankRemittanceNo: faker.string.uuid(),
    outOfRemittanceForOrder: faker.commerce.price(),
    firc: faker.string.uuid(),
    buyercustomerId: faker.string.uuid(),
    buyerDetails: {
      Name: faker.person.fullName(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      Phone: faker.phone.number(),
      Email: faker.internet.email(),
    },
    remittercustomerId: faker.string.uuid(),
    remitterDetails: {
      Name: faker.person.fullName(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      Phone: faker.phone.number(),
      Email: faker.internet.email(),
    },
    osrNo: faker.number.int(),
    osrDate: faker.date.past(),
    invoiceNo: faker.string.uuid(),
    invoiceDate: faker.date.past({ years: 6 }),
    edpms: faker.commerce.price(),
    totalOrderValue: faker.commerce.price(),
    balanceAmount: faker.commerce.price(),
    awb: faker.string.uuid(),
    sb: faker.number.int(1000),
    sbd: faker.date.past(),
    sbAddress: {
      Name: faker.person.fullName(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
    },
    sbSubmitted: faker.helpers.arrayElement(["yes", "no"]),
    sbFilingDate: faker.date.past(),
    sbRealisedDate: faker.date.past(),
    ebrc: faker.string.uuid(),
    yesNoOption: faker.helpers.arrayElement(["yes", "no"]),
    portCode: faker.helpers.arrayElement(["INBLR4", "INMAA1"]),
    createdAt: new Date(), // Set createdAt to the current time
  };
};

const generateFakeOrders = async () => {
  try {
    const fakeOrders = await Promise.all(
      Array.from({ length: 300 }, () => generateFakeOrder())
    );
    const result = await Order.insertMany(fakeOrders);
    console.log(`${result.length} fake orders inserted successfully`);
  } catch (err) {
    console.error("Error inserting fake orders:", err.message);
  } finally {
    mongoose.disconnect();
  }
};
