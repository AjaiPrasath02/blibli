const BASE_URL = "http://localhost:9092/orders";



export default {
  async placeOrder(orderDto) {
    const response = await fetch(`${BASE_URL}/addOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDto),
    });
    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.statusText}`);
    }
    return await response.json();
  },
  async updateOrder(orderDto) {
    const response = await fetch(`${BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDto),
    });
    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }
    return await response.json();
  },
};
