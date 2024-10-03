const axios = require("axios");

exports.getOrder = async (req, res) => {
  try {
    const response = await axios.get(process.env.SHOPIFY_STORE_URL, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
      },
    });

    // console.log("response", response);
    const orders = response.data.orders;
    const totalOrders = orders.length;

    let totalSales = 0;
    orders.forEach((order) => (totalSales += parseFloat(order.total_price)));

    const conversionRate = totalOrders > 0 ? totalOrders / totalSales : 0;

    return res.status(200).json({
      code: 200,
      message: "Data get successfully",
      totalOrders,
      totalSales,
      conversionRate,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
