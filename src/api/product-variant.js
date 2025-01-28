const BASE_URL = "http://localhost:9091/product-inventory"; 

export default {
  async getVariantsByProductId(productId) {
    const response = await fetch(`${BASE_URL}/product/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch variants for product ID ${productId}: ${response.statusText}`);
    }
    return await response.json();
  },
};
