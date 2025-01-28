import { defineStore } from "pinia";
import productVariantApi from "@/api/product-variant.js";

export const VariantStore = defineStore("variantStore", {
  state: () => ({
    variants: [], 
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchVariantsByProductId(productId) {
      this.isLoading = true;
      this.error = null;
      try {
        const variants = await productVariantApi.getVariantsByProductId(productId);
        this.variants = variants;
        console.log("Variants fetched successfully:", this.variants);
      } catch (error) {
        this.error = error.message;
        console.error(`Error fetching variants for product ID ${productId}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
export default VariantStore;
