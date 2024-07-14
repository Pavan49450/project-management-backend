const axios = require("axios");
const { generateAccessToken } = require("../service/paypalService.js");

const base = "https://api-m.sandbox.paypal.com";

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
exports.createOrder = async (req, res) => {
  try {
    const { cart } = req.body; // Assuming cart details are sent in the request body
    const accessToken = await generateAccessToken();

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.totalAmount, // Replace with dynamic value based on cart
          },
        },
      ],
    };

    const response = await axios.post(`${base}/v2/checkout/orders`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};
