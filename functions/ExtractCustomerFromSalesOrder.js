let ExtractCustomerFromSalesOrder = function(
    ncUtil,
    channelProfile,
    flowContext,
    payload,
    callback)
{

    log("Building callback object...", ncUtil);
    let out = {
        ncStatusCode: null,
        payload: {}
    };

    // Check callback
    if (!callback) {
        throw new Error("A callback function was not provided");
    } else if (typeof callback !== 'function') {
        throw new TypeError("callback is not a function")
    }

    try {
        let notFound = false;
        let invalid = false;
        let invalidMsg = "";
        let data = {};

        // Check ncUtil
        if (!ncUtil) {
            invalid = true;
            invalidMsg = "ExtractCustomerFromSalesOrder - Invalid Request: ncUtil was not passed into the function";
        }

        // Check Payload
        if (payload) {
            if (!payload.doc) {
                invalidMsg = "Extract Customer From Sales Order - Invalid Request: payload.doc was not provided";
                invalid = true;
            } else if (!payload.doc.Customer) {
                notFound = true;
                invalidMsg = "Extract Customer From Sales Order - Customer Not Found: The order has no customer (payload.doc.Customer)";
            } else {
                data = payload.doc.Customer;
            }
        } else {
            invalidMsg = "Extract Customer From Sales Order - Invalid Request: payload was not provided";
            invalid = true;
        }

        if (!invalid && !notFound) {
          // Customer Found
          out.payload.doc = data;
          out.ncStatusCode = 200;

          callback(out);
        } else if (!invalid && notFound){
          // Customer Not Found
          log(invalidMsg, ncUtil);
          out.ncStatusCode = 204;

          callback(out);
        } else {
          // Invalid Request (payload or payload.doc was not passed in)
          log(invalidMsg, ncUtil);
          out.ncStatusCode = 400;
          out.payload.error = { err: invalidMsg };

          callback(out);
        }
    }
    catch (err){
        logError("Exception occurred in ExtractCustomerFromSalesOrder - " + err, ncUtil);
        out.ncStatusCode = 500;
        out.payload.error = { err: err.message, stackTrace: err.stackTrace };
        callback(out);
    }

}

function logError(msg, ncUtil) {
    console.log("[error] " + msg);
}

function log(msg, ncUtil) {
    console.log("[info] " + msg);
}
module.exports.ExtractCustomerFromSalesOrder = ExtractCustomerFromSalesOrder;
