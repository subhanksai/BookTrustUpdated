/**
 * Updates a MongoDB query object with identifiers.
 * Handles both array and single-value cases.
 *
 * @param {Object} identifiers - The identifiers for filtering.
 * @param {Object} query - The existing MongoDB query object.
 * @returns {Object} - The updated query object.
 */
function updateQueryWithIdentifiers(identifiers, query) {
  if (identifiers && typeof identifiers === "object") {
    Object.keys(identifiers).forEach((key) => {
      const values = identifiers[key];

      if (Array.isArray(values)) {
        // Handle cases where the identifier is an array of values
        switch (key) {
          case "i1": // orderProformaNo
            query.orderProformaNo = {
              $in: values.map((value) => value.toString()), // Convert to strings
            };
            break;
          case "i2": // customerId
            query.remittercustomerId = {
              $in: values.map((value) => value.toString()),
            };
            break;
          case "i3": // invoiceNo
            query.invoiceNo = { $in: values.map((value) => value.toString()) };
            break;
          case "i4": // paypalInvoiceNo
            query.paypalInvoiceNo = {
              $in: values.map((value) => value.toString()),
            };
          case "i5": // paypalInvoiceNo
            query.buyercustomerId = {
              $in: values.map((value) => value.toString()),
            };
            break;
          default:
            break;
        }
      } else {
        // Handle cases where the identifier is a single value
        switch (key) {
          case "i1":
            query.orderProformaNo = values.toString();
            break;
          case "i2":
            query.remittercustomerId = values.toString();
            break;
          case "i3":
            query.invoiceNo = values.toString();
            break;
          case "i4":
            query.paypalInvoiceNo = values.toString();
            break;
          case "i5":
            query.buyercustomerId = values.toString();
            break;
          default:
            break;
        }
      }
    });
  }

  return query; // Return the updated query
}

/**
 * Parses query parameters from a request object.
 * Converts comma-separated values into arrays.
 *
 * @param {Object} query - The query parameters from the request.
 * @returns {Object} - The parsed query parameters.
 */
const parseQueryParams = (query) => {
  const parsedParams = {};

  Object.keys(query).forEach((key) => {
    if (query[key]) {
      // Split the value by commas and store as an array
      parsedParams[key] = query[key].split(",");
    }
  });

  return parsedParams;
};

module.exports = {
  updateQueryWithIdentifiers,
  parseQueryParams,
};
