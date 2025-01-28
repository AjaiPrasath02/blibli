const BASE_URL = "http://localhost:9091/products";
const CATEGORY_URL = "http://localhost:9091/categories";

export default {
  async getAllProducts() {
    const response = await fetch(`${BASE_URL}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products = await response.json();

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          const categoryResponse = await fetch(`${CATEGORY_URL}/${product.categoryId}`);
          if (!categoryResponse.ok) {
            throw new Error(`Failed to fetch category for product ID: ${product.id}`);
          }
          const category = await categoryResponse.json();
          return {
            ...product,
            category: category.name, 
          };
        } catch (error) {
          console.error(`Error fetching category for product ${product.id}:`, error);
          return {
            ...product,
            category: "Unknown", 
          };
        }
      })
    );

    return enrichedProducts;
  },


  async getProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}: ${response.statusText}`);
    }
    return await response.json();
  },
};
