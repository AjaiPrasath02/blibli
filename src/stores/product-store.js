



import { defineStore } from "pinia";
import productApi from "@/api/product.js";

export const ProductStore = defineStore("productStore", {
  state: () => ({
    productList: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchAllProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const products = await productApi.getAllProducts();
        this.productList = products;
        console.log("Products fetched successfully:", this.productList);
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching products:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const product = await productApi.getProductById(id);
        this.selectedProduct = product;
        console.log("Product fetched successfully:", this.selectedProduct);
      } catch (error) {
        this.error = error.message;
        console.error(`Error fetching product with ID ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
export default ProductStore;
